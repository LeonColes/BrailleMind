// 一般请求成功返回的数据格式
export const responseJson = (code: number, msg: string, data: string | object | [] | null) => {
  return { code, msg, data }
}

/**
 * 将日期时间字符串转换为北京时间
 * @param dateTimeStr - 日期时间字符串
 * @returns 转换后的北京时间字符串
 */
export const toBjTime = (dateTimeStr: string) => {
  return new Date(dateTimeStr).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}