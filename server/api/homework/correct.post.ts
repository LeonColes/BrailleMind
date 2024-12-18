import Joi from "joi";
import db from "~/utils/db/mysql";
import { responseJson } from "~/utils/helper";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 格式校验
  const schema = Joi.object({
    homework_id: Joi.string().uuid().required(),
    student_id: Joi.string().uuid().required(),
    score: Joi.number().required()
  });

  try {
    await schema.validateAsync(body);
  } catch (err) {
    return responseJson(400, '参数格式错误', null);
  }

  try {
    // 批改作业
    await db.execute(
      'INSERT INTO homework_grades (homework_id, student_id, score, created_at, updated_at) VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
      [body.homework_id, body.student_id, body.score]
    );

    return responseJson(200, '作业批改成功', null);
  } catch (err) {
    return responseJson(500, '作业批改失败', (err as Error).message);
  }
});