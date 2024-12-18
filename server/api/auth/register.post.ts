import Joi from "joi"
import md5 from "md5"
import { v4 as uuidv4 } from "uuid"
import db from "~/utils/db/mysql"
import redis from "~/utils/db/redis"
import { responseJson } from "~/utils/helper"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 格式校验
  const schema = Joi.object({
    nickname: Joi.any().required(),
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required(),
    phone: Joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/),
    password: Joi.any().required(),
  })

  try { await schema.validateAsync(body) }
  catch (err) { return responseJson(400, '参数格式错误', null) }
  
  // 严加密
  const salt = 'suphenv'
  const password = md5(md5(body.password) + salt)
  // 36位uuid
  const uuid = uuidv4()

  try {
    // 查重
    const [checkUser] = await db.execute('SELECT * FROM users WHERE phone = ?', [body.phone]) as RowDataPacket[]
    if (checkUser.length > 0) return responseJson(409, '用户已存在', null)

    // 验证码时效
    const redisCode = await redis.get(body.email)
    if (!redisCode || redisCode !== body.code) return responseJson(400, '验证码无效或已过期', null)

    // 数据库注入
    const [insertUser] = await db.execute(
      'INSERT INTO users (id, nickname, phone, password, email, created_at) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP() + INTERVAL 8 HOUR)',
      [uuid, body.nickname, body.phone, password, body.email]
    ) as ResultSetHeader[]

    // 删除验证码
    await redis.del(body.email)

    // 注册状态
    if (insertUser.affectedRows == 1) return responseJson(200, '注册成功', null)
    else return responseJson(500, '注册失败', null)
  }
  catch (err) {
    return responseJson(500, '服务器错误', (err as Error).message)
  }
})
