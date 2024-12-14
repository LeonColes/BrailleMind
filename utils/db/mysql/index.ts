
import mysql from "mysql2/promise"

const config = useRuntimeConfig()

const db = mysql.createPool({
  host: config.mysql.host,
  database: config.mysql.database,
  user: config.mysql.user,
  password: config.mysql.password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z'
})

export default db