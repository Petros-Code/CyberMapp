import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let dbConfig

dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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