import db from '~/utils/db/mysql'
import { responseJson, toBjTime } from '~/utils/helper'
import { RowDataPacket } from 'mysql2'

export default defineEventHandler(async event => {
  try {
    // 查询所有作业
    const [rows] = await db.query('SELECT * FROM homework WHERE is_deleted = FALSE ORDER BY updated_at DESC')

    // 将时间字段转换为北京时间
    const convertedRows = (rows as RowDataPacket[]).map(row => ({
      ...row,
      time_range_start: toBjTime(row.time_range_start),
      time_range_end: toBjTime(row.time_range_end),
      created_at: toBjTime(row.created_at),
      updated_at: toBjTime(row.updated_at),
    }))

    return responseJson(200, '作业列表获取成功', convertedRows)
  } catch (err) {
    return responseJson(500, '作业列表获取失败', (err as Error).message)
  }
})