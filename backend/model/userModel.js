import pool from "../config/db.js"
import { encrypt, decrypt } from "../utils/crypto.js"

// Créer un user
export const createUser = async ({ username, email, password, verify_token }) => {
    const [result] = await pool.execute(
        `INSERT INTO users (username, email, password, verify_token)
        VALUES (?, ?, ?, ?)`,
        [encrypt(username), email, password, verify_token]
    )
    return result
}

// Trouver un user par email
export const findUserByEmail = async (email) => {
    const [rows] = await pool.execute(
        `SELECT * FROM users where email = ?`,
        [email]
    )
    if (!rows[0]) return null
    return { ...rows[0], username: decrypt(rows[0].username) }
}

// trouver un user par id ?
export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, username, email, is_verified, created_at
     FROM users WHERE id = ?`,
    [id]
  )
  if (!rows[0]) return null
  return { ...rows[0], username: decrypt(rows[0].username) }
}

// vérifier un user via smtp mail
export const verifyUserToken = async (token) => {
    const [result] = await pool.execute(
        `UPDATE users
        SET is_verified = TRUE, verify_token = NULL
        WHERE verify_token = ?`,
        [token]
    )
    return result
}