import Joi from "joi";
import db from "~/utils/db/mysql";
import { responseJson } from "~/utils/helper";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 格式校验
  const schema = Joi.object({
    id: Joi.string().uuid().required()
  });

  try {
    await schema.validateAsync(body);
  } catch (err) {
    return responseJson(400, '参数格式错误', null);
  }

  try {
    // 逻辑删除作业
    await db.execute(
      'UPDATE homework SET is_deleted = TRUE, updated_at = UTC_TIMESTAMP() WHERE id = ?',
      [body.id]
    );

    return responseJson(200, '作业删除成功', null);
  } catch (err) {
    return responseJson(500, '作业删除失败', (err as Error).message);
  }
});