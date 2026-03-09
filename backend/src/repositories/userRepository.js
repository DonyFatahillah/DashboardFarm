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
}

module.exports = new UserRepository();
