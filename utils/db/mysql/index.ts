import mysql from 'mysql2'

export const db = () => (
  mysql.createPool({
    host: '8.218.173.145',
    database: 'braille',
    user: 'root',
    password: 'symxll',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }).promise()
)