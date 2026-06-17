const pool = require('../config/db');

class UserRepository {
  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT id, username, role, kandang_id FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  async findByName(username) {
    const [rows] = await pool.query('SELECT id, username FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  async findAll() {
    const [rows] = await pool.query('SELECT u.id, u.username, u.role, u.kandang_id, k.nama as kandang_nama FROM users u LEFT JOIN kandang k ON u.kandang_id = k.id');
    return rows;
  }

  async create(userData) {
    const { username, password, role, kandang_id } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, kandang_id) VALUES (?, ?, ?, ?)',
      [username, password, role, kandang_id]
    );
    return result.insertId;
  }

  async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new UserRepository();
