import Joi from "joi"
import md5 from "md5"
import { db } from "../../../utils/db/mysql"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // 格式校验
  const schema =Joi.object( {
    nickname:Joi.any().required(),
    phone: Joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/),
    password: Joi.any().required(),
    })
    try {
      const value = await schema.validateAsync(body)
      console.log(value)
    } catch (err) {
      return { code: 400, msg: '参数错误', data: null }
    }
    // 严加密
    const salt = 'suphenv'
    const password = md5(md5(body.password) + salt)

    // 查重
    try {
      const [rows] = await db().execute('SELECT * FROM users WHERE phone = ?', [body.phone])
    if (rows.length > 0)  return { code: 409, msg: '用户已存在', data: null }
    // 注册
    const [inserUser] = await db().execute('INSERT INTO users (nickname,phone,password) VALUES (?,?,?)', [body.nickname,body.phone,password])
    if (inserUser.affectedRows == 1) return { code: 200, msg: '注册成功', data: null }
    } catch(err) {
      return { code: 500, msg: '服务器错误', data: null }
    }

    return null
})
