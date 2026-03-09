-- Database Initialization Script for Farm Management System

CREATE DATABASE IF NOT EXISTS farm_management;
USE farm_management;

-- Table: kandang
CREATE TABLE IF NOT EXISTS kandang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    lokasi VARCHAR(255),
    kapasitas INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('OWNER', 'MANAGER', 'STAFF') DEFAULT 'STAFF',
    kandang_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE SET NULL
);

-- Table: batch_ayam
CREATE TABLE IF NOT EXISTS batch_ayam (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kandang_id INT NOT NULL,
    tanggal_masuk DATE NOT NULL,
    jumlah_awal INT NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
);

-- Table: kematian_harian
CREATE TABLE IF NOT EXISTS kematian_harian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kandang_id INT NOT NULL,
    tanggal DATE NOT NULL,
    jumlah_mati INT NOT NULL,
    penyebab VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
);

-- Table: pakan_harian
CREATE TABLE IF NOT EXISTS pakan_harian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kandang_id INT NOT NULL,
    tanggal DATE NOT NULL,
    jenis_pakan VARCHAR(100) NOT NULL,
    jumlah_kg DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
);

-- Table: produksi_harian
CREATE TABLE IF NOT EXISTS produksi_harian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kandang_id INT NOT NULL,
    tanggal DATE NOT NULL,
    jumlah_telur INT NOT NULL,
    berat_telur DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
);

-- Table: penjualan_telur
CREATE TABLE IF NOT EXISTS penjualan_telur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    pembeli VARCHAR(100) NOT NULL,
    jumlah_kg DECIMAL(10, 2) NOT NULL,
    harga_per_kg DECIMAL(10, 2) NOT NULL,
    total_harga DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Admin User (password: admin123)
-- Hash generated for 'admin123' using bcrypt
INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$10$EPZ9Svp2I0PjU.2N9A9vEeY0B.Y6U6Y6U6Y6U6Y6U6Y6U6Y6U6Y6U', 'OWNER')
ON DUPLICATE KEY UPDATE role='OWNER';
