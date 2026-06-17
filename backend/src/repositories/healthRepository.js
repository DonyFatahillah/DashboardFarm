const pool = require('../config/db');

class HealthRepository {
  async create(data) {
    const { kandang_id, jenis_kegiatan, tanggal_rencana } = data;
    const [result] = await pool.query(
      'INSERT INTO kesehatan_ayam (kandang_id, jenis_kegiatan, tanggal_rencana) VALUES (?, ?, ?)',
      [kandang_id, jenis_kegiatan, tanggal_rencana]
    );
    return { id: result.insertId, ...data };
  }

  async getAll() {
    const [rows] = await pool.query('SELECT k.*, kn.nama as nama_kandang FROM kesehatan_ayam k JOIN kandang kn ON k.kandang_id = kn.id ORDER BY k.tanggal_rencana ASC');
    return rows;
  }
}

module.exports = new HealthRepository();
