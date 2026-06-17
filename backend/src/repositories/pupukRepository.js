const pool = require('../config/db');

class PupukRepository {
  async create(data) {
    const { tanggal, pembeli, jumlah_karung, harga_per_karung, total_harga } = data;
    const [result] = await pool.query(
      'INSERT INTO penjualan_pupuk (tanggal, pembeli, jumlah_karung, harga_per_karung, total_harga) VALUES (?, ?, ?, ?, ?)',
      [tanggal, pembeli, jumlah_karung, harga_per_karung, total_harga]
    );
    return { id: result.insertId, ...data };
  }

  async getAll() {
    const [rows] = await pool.query('SELECT * FROM penjualan_pupuk ORDER BY tanggal DESC');
    return rows;
  }
}

module.exports = new PupukRepository();
