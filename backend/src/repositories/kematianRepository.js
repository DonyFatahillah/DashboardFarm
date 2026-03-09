const pool = require('../config/db');

class KematianRepository {
  async create(data) {
    const { kandang_id, tanggal, jumlah_mati, penyebab } = data;
    const [result] = await pool.query(
      'INSERT INTO kematian_harian (kandang_id, tanggal, jumlah_mati, penyebab) VALUES (?, ?, ?, ?)',
      [kandang_id, tanggal, jumlah_mati, penyebab]
    );
    return { id: result.insertId, ...data };
  }

  async findByFilters(kandang_id, start, end) {
    let query = `
      SELECT km.*, k.nama as nama_kandang
      FROM kematian_harian km
      JOIN kandang k ON km.kandang_id = k.id
      WHERE 1=1
    `;
    const params = [];

    if (kandang_id) {
      query += ' AND km.kandang_id = ?';
      params.push(kandang_id);
    }
    if (start) {
      query += ' AND km.tanggal >= ?';
      params.push(start);
    }
    if (end) {
      query += ' AND km.tanggal <= ?';
      params.push(end);
    }

    query += ' ORDER BY km.tanggal DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = new KematianRepository();
