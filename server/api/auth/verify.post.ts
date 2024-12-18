import Joi from "joi"
import nodemailer from "nodemailer"
import redis from "~/utils/db/redis"
import { responseJson } from "~/utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 格式校验
  const schema = Joi.object({
    nickname: Joi.string().required(),
    email: Joi.string().email().required(),
  })

  try { await schema.validateAsync(body) }
  catch (err) { return responseJson(400, '参数格式错误', null) }

  // 邮件验证
  try {
    // 限制发送频率为1分钟/次
    const latesRequest = await redis.get(`${body.email}:latestRequest`) 
    if (latesRequest && Date.now() - Number(latesRequest) < 60 * 1000) {
      const afterRequest = Math.ceil(60 - (Date.now() - Number(latesRequest)) / 1000)
      return responseJson(429, `发送频率过快，请${afterRequest}秒后再试`, null)
    }

    const config = useRuntimeConfig()

    // 邮件发送配置
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: 465,
      secure: true,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      }
    })
    
    // 生成验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // 缓存验证码，15分钟有效期
    await redis.set(body.email, code, 'EX', 15 * 60)
    await redis.set(`${body.email}:latestRequest`, Date.now().toString(), 'EX', 60)

    // 邮件接收配置
    const mailOptions = {
      from: `"Suphenv Team"<${config.smtp.user}>`,
      to: body.email,
      subject: '邮箱验证',
      html: `
          <h2>您好! ${body.nickname}，</h2>
          <p>感谢您注册 Suphenv！以下是您的验证码：</p>
          <h1>${code}</h1>
          <p>验证码的有效期为<b>15</b>分钟，请您尽快完成验证。</p>
          <p>如果您没有注册此账号，请忽略此邮件。</p>
        `
    }

    // 发送邮件
    await transporter.sendMail(mailOptions)
    return responseJson(200, '邮件已发送，请注意查收', null)
  }
  catch (err) {
    await redis.del(body.email)
    return responseJson(500, '服务器错误', (err as Error).message)
  }
})