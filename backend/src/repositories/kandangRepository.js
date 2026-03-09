const pool = require('../config/db');

class KandangRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM kandang');
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM kandang WHERE id = ?', [id]);
    return rows[0];
  }

  async create(data) {
    const { nama, lokasi, kapasitas } = data;
    const [result] = await pool.query(
      'INSERT INTO kandang (nama, lokasi, kapasitas) VALUES (?, ?, ?)',
      [nama, lokasi, kapasitas]
    );
    return { id: result.insertId, ...data };
  }

  async update(id, data) {
    const { nama, lokasi, kapasitas } = data;
    await pool.query(
      'UPDATE kandang SET nama = ?, lokasi = ?, kapasitas = ? WHERE id = ?',
      [nama, lokasi, kapasitas, id]
    );
    return { id, ...data };
  }

  async delete(id) {
    await pool.query('DELETE FROM kandang WHERE id = ?', [id]);
    return true;
  }
}

module.exports = new KandangRepository();
