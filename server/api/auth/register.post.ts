import Joi from "joi"
import md5 from "md5"
import { v4 as uuidv4 } from "uuid"
import { db } from "../../../utils/db/mysql"
import { responseJson } from "../../../utils/helper"
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
    const [checkUser] = await db().execute('SELECT * FROM users WHERE phone = ?', [body.phone]) as RowDataPacket[]
    if (checkUser.length > 0) return responseJson(409, '用户已存在', null)

    // 验证码时效
    const [checkCode] = await db().execute(
      'SELECT * FROM verify_codes WHERE email = ? AND code = ? AND expire_time > NOW()',
      [body.email, body.code]
    ) as RowDataPacket[] | number[]
    if(checkCode == 0) return responseJson(400, '验证码无效或已过期', null)

    // 删除验证码，后续用redis
    await db().execute(
      'DELETE FROM verify_codes WHERE email = ? AND code = ?',
      [body.email, body.code]
    )

    // 数据库注入
    const [insertUser] = await db().execute(
      'INSERT INTO users (id, nickname, phone, password, email) VALUES (?,?,?,?,?)',
      [uuid, body.nickname, body.phone, password, body.email]
    ) as ResultSetHeader[]

    // 注册状态
    if (insertUser.affectedRows == 1) return responseJson(200, '注册成功', null)
    else return responseJson(500, '注册失败', null)
  }
  catch (err) {
    return responseJson(500, '服务器错误', (err as Error).message)
  }
})
