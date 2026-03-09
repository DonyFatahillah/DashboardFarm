const pool = require('../config/db');

class PenjualanRepository {
  async create(data) {
    const { tanggal, pembeli, jumlah_kg, harga_per_kg, total_harga } = data;
    const [result] = await pool.query(
      'INSERT INTO penjualan_telur (tanggal, pembeli, jumlah_kg, harga_per_kg, total_harga) VALUES (?, ?, ?, ?, ?)',
      [tanggal, pembeli, jumlah_kg, harga_per_kg, total_harga]
    );
    return { id: result.insertId, ...data };
  }

  async findByFilters(start, end) {
    let query = 'SELECT * FROM penjualan_telur WHERE 1=1';
    const params = [];

    if (start) {
      query += ' AND tanggal >= ?';
      params.push(start);
    }
    if (end) {
      query += ' AND tanggal <= ?';
      params.push(end);
    }

    query += ' ORDER BY tanggal DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = new PenjualanRepository();
