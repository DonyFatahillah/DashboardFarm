const pool = require('./src/config/db');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    console.log('Starting database seeding...');

    // Create Table: kandang
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kandang (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        lokasi VARCHAR(255),
        kapasitas INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "kandang" checked/created.');

    // Create Table: users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('OWNER', 'MANAGER', 'STAFF') DEFAULT 'STAFF',
        kandang_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE SET NULL
      )
    `);
    console.log('Table "users" checked/created.');

    // Create Table: batch_ayam
    await pool.query(`
      CREATE TABLE IF NOT EXISTS batch_ayam (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kandang_id INT NOT NULL,
        tanggal_masuk DATE NOT NULL,
        jumlah_awal INT NOT NULL,
        keterangan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
      )
    `);
    console.log('Table "batch_ayam" checked/created.');

    // Create Table: kematian_harian
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kematian_harian (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kandang_id INT NOT NULL,
        tanggal DATE NOT NULL,
        jumlah_mati INT NOT NULL,
        penyebab VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
      )
    `);
    console.log('Table "kematian_harian" checked/created.');

    // Create Table: pakan_harian
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pakan_harian (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kandang_id INT NOT NULL,
        tanggal DATE NOT NULL,
        jenis_pakan VARCHAR(100) NOT NULL,
        jumlah_kg DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
      )
    `);
    console.log('Table "pakan_harian" checked/created.');

    // Create Table: produksi_harian
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produksi_harian (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kandang_id INT NOT NULL,
        tanggal DATE NOT NULL,
        jumlah_telur INT NOT NULL,
        berat_telur DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
      )
    `);
    console.log('Table "produksi_harian" checked/created.');

    // Create Table: penjualan_telur
    await pool.query(`
      CREATE TABLE IF NOT EXISTS penjualan_telur (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tanggal DATE NOT NULL,
        pembeli VARCHAR(100) NOT NULL,
        jumlah_kg DECIMAL(10, 2) NOT NULL,
        harga_per_kg DECIMAL(10, 2) NOT NULL,
        total_harga DECIMAL(12, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "penjualan_telur" checked/created.');

    // Create Table: kesehatan_ayam
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kesehatan_ayam (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kandang_id INT NOT NULL,
        jenis_kegiatan VARCHAR(100) NOT NULL,
        tanggal_rencana DATE NOT NULL,
        status ENUM('PENDING', 'DONE') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
      )
    `);
    console.log('Table "kesehatan_ayam" checked/created.');

    // Create Table: telur_rusak
    await pool.query(`
      CREATE TABLE IF NOT EXISTS telur_rusak (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kandang_id INT NOT NULL,
        tanggal DATE NOT NULL,
        jumlah INT NOT NULL,
        kualitas_keterangan VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
      )
    `);
    console.log('Table "telur_rusak" checked/created.');

    // Create Table: absen_karyawan
    await pool.query(`
      CREATE TABLE IF NOT EXISTS absen_karyawan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        nama_luar VARCHAR(100) NULL,
        tanggal DATE NOT NULL,
        status ENUM('HADIR', 'IZIN', 'SAKIT', 'ALPHA') NOT NULL,
        keterangan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Table "absen_karyawan" checked/created.');

    // Create Table: penjualan_pupuk
    await pool.query(`
      CREATE TABLE IF NOT EXISTS penjualan_pupuk (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tanggal DATE NOT NULL,
        pembeli VARCHAR(100) NOT NULL,
        jumlah_karung INT NOT NULL,
        harga_per_karung DECIMAL(10, 2) NOT NULL,
        total_harga DECIMAL(12, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "penjualan_pupuk" checked/created.');

    // Seed Initial Admin User
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'OWNER']
      );
      console.log('Initial admin user created (admin / admin123) with role OWNER.');
    } else {
      console.log('Admin user already exists. Updating role to OWNER.');
      await pool.query('UPDATE users SET role = ? WHERE username = ?', ['OWNER', 'admin']);
    }

    console.log('Database seeding/update completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
