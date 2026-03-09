const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, kandang_id: user.kandang_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }
}

module.exports = new AuthService();
