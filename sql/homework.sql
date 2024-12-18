-- 删除现有表（如果存在）
DROP TABLE IF EXISTS homework_grades;
DROP TABLE IF EXISTS homework_submissions;
DROP TABLE IF EXISTS homework_files;
DROP TABLE IF EXISTS homework;
DROP TABLE IF EXISTS students;

-- 学生表
CREATE TABLE students (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '学生ID',
  name VARCHAR(255) NOT NULL COMMENT '学生姓名',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT '学生邮箱',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '学生表';

-- 作业表
CREATE TABLE homework (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '作业ID',
  name VARCHAR(255) NOT NULL COMMENT '作业名称',
  full_score INT NOT NULL COMMENT '作业满分',
  pass_score INT NOT NULL COMMENT '作业及格分',
  content TEXT NOT NULL COMMENT '作业内容',
  time_range_start DATETIME NOT NULL COMMENT '作业开始时间',
  time_range_end DATETIME NOT NULL COMMENT '作业结束时间',
  publish_type ENUM('immediate', 'scheduled') NOT NULL COMMENT '发布方式',
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否删除',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '作业表';

-- 文件表
CREATE TABLE homework_files (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '文件ID',
  homework_id CHAR(36) NOT NULL COMMENT '作业ID',
  file_url VARCHAR(255) NOT NULL COMMENT '文件URL',
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否删除',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (homework_id) REFERENCES homework(id) ON DELETE CASCADE
) COMMENT '文件表';

-- 学生提交表
CREATE TABLE homework_submissions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '提交ID',
  homework_id CHAR(36) NOT NULL COMMENT '作业ID',
  student_id CHAR(36) NOT NULL COMMENT '学生ID',
  submission_content TEXT NOT NULL COMMENT '提交内容',
  submission_file_url VARCHAR(255) COMMENT '提交文件URL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (homework_id) REFERENCES homework(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) COMMENT '学生提交表';

-- 作业批改表
CREATE TABLE homework_grades (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '批改ID',
  homework_id CHAR(36) NOT NULL COMMENT '作业ID',
  student_id CHAR(36) NOT NULL COMMENT '学生ID',
  score INT NOT NULL COMMENT '分数',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (homework_id) REFERENCES homework(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) COMMENT '作业批改表';

-- 插入学生记录
INSERT INTO students (id, name, email) VALUES
('8f937326-bd84-11ef-ba7c-0242ac110003', '学生A', 'studentA@example.com'),
('8f9377fa-bd84-11ef-ba7c-0242ac110003', '学生B', 'studentB@example.com'),
('f46d94aa-bd84-11ef-ba7c-0242ac110003', '学生C', 'studentC@example.com');

-- 插入作业记录
INSERT INTO homework (id, name, full_score, pass_score, content, time_range_start, time_range_end, publish_type) VALUES
('1ad152a4-2c8f-4bfa-baec-b97141398c18', '数学作业', 120, 70, '请完成以下数学题目。', '2025-01-01 08:00:00', '2025-01-07 23:59:59', 'immediate'),
('22d2e1ab-bd86-11ef-ba7c-0242ac110003', '数学作业', 120, 70, '请完成以下数学题目。', '2025-01-01 16:00:00', '2025-01-08 07:59:59', 'immediate'),
('4c4d9786-bd86-11ef-ba7c-0242ac110003', '数学作业', 120, 70, '请完成以下数学题目。', '2025-01-01 16:00:00', '2025-01-08 07:59:59', 'immediate'),
('654d9896-5847-481b-9398-438951135c4f', '语文作业', 120, 60, '请完成以下语文题目。', '2025-01-01 08:00:00', '2025-01-07 23:59:59', 'immediate'),
('ef0a0857-581a-4555-967a-d87ecbae6537', '英语作业', 100, 60, '请完成以下英语题目。', '2024-01-01 08:00:00', '2024-01-07 23:59:59', 'immediate');

-- 插入文件记录
INSERT INTO homework_files (id, homework_id, file_url) VALUES
('8f937326-bd84-11ef-ba7c-0242ac110003', '1ad152a4-2c8f-4bfa-baec-b97141398c18', 'https://example.com/file1.pdf'),
('8f9377fa-bd84-11ef-ba7c-0242ac110003', '1ad152a4-2c8f-4bfa-baec-b97141398c18', 'https://example.com/file2.pdf'),
('f46d94aa-bd84-11ef-ba7c-0242ac110003', '22d2e1ab-bd86-11ef-ba7c-0242ac110003', 'https://example.com/file1.pdf'),
('f46d9a1c-bd84-11ef-ba7c-0242ac110003', '22d2e1ab-bd86-11ef-ba7c-0242ac110003', 'https://example.com/file2.pdf');

-- 插入学生提交记录
INSERT INTO homework_submissions (id, homework_id, student_id, submission_content, submission_file_url) VALUES
('8f937326-bd84-11ef-ba7c-0242ac110003', '1ad152a4-2c8f-4bfa-baec-b97141398c18', '8f937326-bd84-11ef-ba7c-0242ac110003', '完成了所有题目', 'https://example.com/submission1.pdf'),
('8f9377fa-bd84-11ef-ba7c-0242ac110003', '1ad152a4-2c8f-4bfa-baec-b97141398c18', '8f9377fa-bd84-11ef-ba7c-0242ac110003', '完成了部分题目', 'https://example.com/submission2.pdf'),
('f46d94aa-bd84-11ef-ba7c-0242ac110003', '22d2e1ab-bd86-11ef-ba7c-0242ac110003', 'f46d94aa-bd84-11ef-ba7c-0242ac110003', '完成了所有题目', 'https://example.com/submission3.pdf');

-- 插入作业批改记录
INSERT INTO homework_grades (id, homework_id, student_id, score) VALUES
('8f937326-bd84-11ef-ba7c-0242ac110003', '1ad152a4-2c8f-4bfa-baec-b97141398c18', '8f937326-bd84-11ef-ba7c-0242ac110003', 95),
('8f9377fa-bd84-11ef-ba7c-0242ac110003', '1ad152a4-2c8f-4bfa-baec-b97141398c18', '8f9377fa-bd84-11ef-ba7c-0242ac110003', 80),
('f46d94aa-bd84-11ef-ba7c-0242ac110003', '22d2e1ab-bd86-11ef-ba7c-0242ac110003', 'f46d94aa-bd84-11ef-ba7c-0242ac110003', 100);