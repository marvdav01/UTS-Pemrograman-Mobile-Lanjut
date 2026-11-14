-- Skema Database Aplikasi DailyTask (MySQL / MariaDB Compatible)

CREATE DATABASE IF NOT EXISTS dailytask_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dailytask_db;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- 2. Tabel Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  due_date DATETIME NOT NULL,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_tasks_user_status (user_id, status),
  INDEX idx_tasks_due_date (due_date)
) ENGINE=InnoDB;

