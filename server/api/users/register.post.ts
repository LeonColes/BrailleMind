import Joi from "joi"
import md5 from "md5"
import { db } from "../../../utils/db/mysql"
import { resopnseJson } from "../../../utils/helper"
import { RowDataPacket, ResultSetHeader } from 'mysql2'; // 导入类型

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
  }
  catch (err) {
    return resopnseJson(400, '参数格式错误', null)
  }
  // 严加密
  const salt = 'suphenv'
  const password = md5(md5(body.password) + salt)

  try {
    // 查重
    const [checkUser] = await db().execute('SELECT * FROM users WHERE phone = ?', [body.phone]) as RowDataPacket[]
    if (checkUser.length > 0) return resopnseJson(409, '用户已存在', null)
    // 注册
    const [inserUser] = await db().execute('INSERT INTO users (nickname,phone,password) VALUES (?,?,?)', [body.nickname, body.phone, password]) as ResultSetHeader[]
    if (inserUser.affectedRows == 1) return resopnseJson(200,'注册成功', null)
  }
  catch (err) {
    return resopnseJson(500, '服务器错误', null)
  }

  // 释放连接
  db().end()
  return null
})
