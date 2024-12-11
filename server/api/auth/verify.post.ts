import Joi from "joi"
import nodemailer from "nodemailer"
import { db } from "../../../utils/db/mysql"
import { responseJson } from "../../../utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 格式校验
  const schema = Joi.object({
    nickname: Joi.any().required(),
    email: Joi.string().email().required(),
  })

  try { await schema.validateAsync(body) }
  catch (err) { return responseJson(400, '参数格式错误', null) }

  // 邮件验证
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    })
    
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expireTime = new Date(Date.now() + 5 * 60 * 1000)
    
    // 邮件配置
    const mailOptions = {
      from: `"Suphenv Team"<${process.env.SMTP_USER}>`,
      to: body.email,
      subject: '邮箱验证',
      html: `
          <h2>您好 ${body.nickname}，</h2>
          <p>感谢您注册 Suphenv！以下是您的验证码：</p>
          <h1>${code}</h1>
          <p>验证码的有效期为<b>5</b>分钟，请您惊恐完成验证。</p>
          <p>如果您没有注册此账号，请忽略此邮箱。</p>
        `
    }

    // 发送邮件
    await transporter.sendMail(mailOptions)

    // 存储验证码到数据库
    await db().execute(
      'INSERT INTO verify_codes (email, code, expire_time) VALUES (?, ?, ?)',
      [body.email, code, expireTime]
    )
    return responseJson(200, '邮件已发送，请注意查收', null)
  }
  catch (err) {
    return responseJson(500, '服务器错误', (err as Error).message)
  }
})
