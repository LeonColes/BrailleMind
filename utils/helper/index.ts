export const resopnseJson = (code: number, msg: string, data: object | [] | null) => {
  return { code, msg, data }
}