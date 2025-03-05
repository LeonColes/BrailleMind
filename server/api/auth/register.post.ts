import Joi from "joi"
import md5 from "md5"
import { v4 as uuidv4 } from "uuid"
import db from "~/utils/db/mysql"
import redis from "~/utils/db/redis"
import { responseJson } from "~/utils/helper"
import { ResultSetHeader } from "mysql2"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 格式校验
  const schema = Joi.object({
    nickname: Joi.string().required(),
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required(),
    password: Joi.string().required(),
  })

  try { await schema.validateAsync(body) }
  catch (err) { return responseJson(400, '参数格式错误', null) }
  
  // 严加密
  const salt = 'leoncole'
  const password = md5(md5(body.password) + salt)
  // 36位uuid
  const uuid = uuidv4()

  try {
    // 验证码时效
    const redisCode = await redis.get(body.email)
    if (!redisCode || redisCode !== body.code) return responseJson(400, '验证码无效或已过期', null)

    // 数据库注入
    const [insertUser] = await db.execute(
      'INSERT INTO users (id, nickname, password, email, phone, created_at) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP() + INTERVAL 8 HOUR)',
      [uuid, body.nickname, password, body.email, null]
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