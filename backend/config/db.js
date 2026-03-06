import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let dbConfig

if (process.env.MYSQL_URL) {
  // Ex: mysql://user:pass@host:port/dbname
  const url = new URL(process.env.MYSQL_URL)

  dbConfig = {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//, ''),
  }
} else {
  dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
}

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
  connectTimeout: 10000,
  timezone: 'Z',
  charset: 'utf8mb4',
})

pool
  .getConnection()
  .then((conn) => {
    console.log('MySQL connecté')
    conn.release()
  })
  .catch((err) => {
    console.error('Erreur connexion MySQL :', err.message)
    process.exit(1)
  })

export default pool