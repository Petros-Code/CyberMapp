CREATE DATABASE IF NOT EXISTS cybermapp_cybermappdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cybermapp_cybermappdb;

-- ─── Table users ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(255) NOT NULL,          -- chiffré AES
  email         VARCHAR(255) NOT NULL UNIQUE,   -- non chiffré (nécessaire pour les lookups)
  password      VARCHAR(255) NOT NULL,
  is_verified   BOOLEAN DEFAULT FALSE,
  verify_token  VARCHAR(255) DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Table locations ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS locations (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL UNIQUE,              -- UNIQUE pour l'upsert
  latitude    DECIMAL(10, 8) NOT NULL,
  longitude   DECIMAL(11, 8) NOT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);