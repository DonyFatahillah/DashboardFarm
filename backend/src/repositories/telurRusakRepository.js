const pool = require('../config/db');

class TelurRusakRepository {
  async create(data) {
    const { kandang_id, tanggal, jumlah, kualitas_keterangan } = data;
    const [result] = await pool.query(
      'INSERT INTO telur_rusak (kandang_id, tanggal, jumlah, kualitas_keterangan) VALUES (?, ?, ?, ?)',
      [kandang_id, tanggal, jumlah, kualitas_keterangan]
    );
    return { id: result.insertId, ...data };
  }

  async getSummary() {
    const [rows] = await pool.query('SELECT SUM(jumlah) as total_rusak, kualitas_keterangan FROM telur_rusak GROUP BY kualitas_keterangan');
    return rows;
  }
}

module.exports = new TelurRusakRepository();
