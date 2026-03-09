const pool = require('../config/db');

class PakanRepository {
  async create(data) {
    const { kandang_id, tanggal, jenis_pakan, jumlah_kg } = data;
    const [result] = await pool.query(
      'INSERT INTO pakan_harian (kandang_id, tanggal, jenis_pakan, jumlah_kg) VALUES (?, ?, ?, ?)',
      [kandang_id, tanggal, jenis_pakan, jumlah_kg]
    );
    return { id: result.insertId, ...data };
  }

  async findByFilters(kandang_id, start, end) {
    let query = `
      SELECT p.*, k.nama as nama_kandang
      FROM pakan_harian p
      JOIN kandang k ON p.kandang_id = k.id
      WHERE 1=1
    `;
    const params = [];

    if (kandang_id) {
      query += ' AND p.kandang_id = ?';
      params.push(kandang_id);
    }
    if (start) {
      query += ' AND p.tanggal >= ?';
      params.push(start);
    }
    if (end) {
      query += ' AND p.tanggal <= ?';
      params.push(end);
    }

    query += ' ORDER BY p.tanggal DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = new PakanRepository();
