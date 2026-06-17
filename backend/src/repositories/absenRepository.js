const pool = require('../config/db');

class AbsenRepository {
  async create(data) {
    const { user_id, nama_luar, tanggal, status, keterangan } = data;
    const [result] = await pool.query(
      'INSERT INTO absen_karyawan (user_id, nama_luar, tanggal, status, keterangan) VALUES (?, ?, ?, ?, ?)',
      [user_id || null, nama_luar || null, tanggal, status, keterangan]
    );
    return { id: result.insertId, ...data };
  }

  async getAll() {
    const [rows] = await pool.query(
      `SELECT a.*, COALESCE(u.username, a.nama_luar) as username 
       FROM absen_karyawan a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.tanggal DESC`
    );
    return rows;
  }
}

module.exports = new AbsenRepository();
