import Joi from "joi";
import db from "~/utils/db/mysql";
import { responseJson } from "~/utils/helper";
import { ResultSetHeader } from "mysql2";
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 格式校验
  const schema = Joi.object({
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

    // 生成 UUID
    const homeworkId = uuidv4();

    // 创建作业
    await db.execute(
      'INSERT INTO homework (id, name, full_score, pass_score, content, time_range_start, time_range_end, publish_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
      [homeworkId, body.name, body.full_score, body.pass_score, body.content, timeRangeStart, timeRangeEnd, body.publish_type]
    );

    // 创建文件记录
    if (body.files && body.files.length > 0) {
      const fileRecords = body.files.map((file: string) => [homeworkId, file, new Date().toISOString().slice(0, 19).replace('T', ' ')]);
      await db.query(
        'INSERT INTO homework_files (homework_id, file_url, created_at) VALUES ?',
        [fileRecords]
      );
    }

    return responseJson(200, '作业发布成功', { id: homeworkId });
  } catch (err) {
    return responseJson(500, '作业发布失败', (err as Error).message);
  }
});