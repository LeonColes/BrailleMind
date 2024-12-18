import Joi from "joi"
import md5 from "md5"
import jwt from "jsonwebtoken"
import db from "~/utils/db/mysql"
import { responseJson } from "~/utils/helper"
import { RowDataPacket } from 'mysql2'; // 导入类型

export default defineEventHandler(async (event) => {

  const body = await readBody(event)

  // 格式校验
  const schema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/),
    password: Joi.any().required(),
  }).xor('email', 'phone', 'username')

  try { await schema.validateAsync(body) }
  catch (err) { return responseJson(400, '参数格式错误', null) }

  // 严加密
  const salt = 'suphenv'
  const password = md5(md5(body.password) + salt)

  try {
    let query = ''
    let params = []

    if (body.email) {
      query = 'SELECT * FROM users WHERE email = ? AND password = ?'
      params = [body.email, password]
    } else if (body.phone) {
      query = 'SELECT * FROM users WHERE phone = ? AND password = ?'
      params = [body.phone, password]
    } else {
      query = 'SELECT * FROM users WHERE nickname = ? AND password = ?'
      params = [body.username, password]
    }

    // 登录校验
    const [checkUser] = await db.execute(query, params) as RowDataPacket[]
    if (checkUser.length == 0) return responseJson(401, '账号或密码错误', null)

    // 生成token
    const token = jwt.sign(
      { id: checkUser[0].id, email: checkUser[0].email },
      'suphenv',
      { expiresIn: '1d' }
    )

    // 用户名
    const name = checkUser[0].nickname || checkUser[0].email || checkUser[0].phone
    const avatar = checkUser[0].avatar

    return responseJson(200, '登录成功', { avatar, name, token })
  }
  catch (err) {
    console.error("登录时出错:", err)
    return responseJson(500, '服务器错误',  (err as Error).message)
  }
})