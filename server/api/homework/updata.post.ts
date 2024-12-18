import Joi from "joi";
import db from "~/utils/db/mysql";
import { responseJson } from "~/utils/helper";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 格式校验
  const schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    full_score: Joi.number().required(),
    pass_score: Joi.number().required(),
    content: Joi.string().required(),
    time_range_start: Joi.date().required(),
    time_range_end: Joi.date().required(),
    publish_type: Joi.string().valid('immediate', 'scheduled').required(),
    files: Joi.array().items(Joi.string().uri()).optional()
  });

  try {
    await schema.validateAsync(body);
  } catch (err) {
    return responseJson(400, '参数格式错误', null);
  }

  try {
    // 将日期时间字符串转换为 MySQL 支持的格式
    const timeRangeStart = new Date(body.time_range_start).toISOString().slice(0, 19).replace('T', ' ');
    const timeRangeEnd = new Date(body.time_range_end).toISOString().slice(0, 19).replace('T', ' ');

    // 更新作业
    await db.execute(
      'UPDATE homework SET name = ?, full_score = ?, pass_score = ?, content = ?, time_range_start = ?, time_range_end = ?, publish_type = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?',
      [body.name, body.full_score, body.pass_score, body.content, timeRangeStart, timeRangeEnd, body.publish_type, body.id]
    );

    // 标记旧的文件记录为已删除
    await db.execute('UPDATE homework_files SET is_deleted = TRUE WHERE homework_id = ?', [body.id]);

    // 插入新的文件记录
    if (body.files && body.files.length > 0) {
      const fileRecords = body.files.map((file: string) => [body.id, file, new Date().toISOString().slice(0, 19).replace('T', ' '), false]);
      await db.query(
        'INSERT INTO homework_files (homework_id, file_url, created_at, is_deleted) VALUES ?',
        [fileRecords]
      );
    }

    return responseJson(200, '作业编辑成功', null);
  } catch (err) {
    return responseJson(500, '作业编辑失败', (err as Error).message);
  }
});