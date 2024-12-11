export const responseJson = (code: number, msg: string, data: string | object | [] | null) => {
  return { code, msg, data }
}