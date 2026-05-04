const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

class UserService {
  async getAllUsers() {
    return await userRepository.findAll();
  }

  async createUser(userData) {
    const existingUser = await userRepository.findByUsername(userData.username);
    if (existingUser) {
      throw { statusCode: 400, message: 'Username already exists' };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userId = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return { id: userId, username: userData.username, role: userData.role };
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    return await userRepository.delete(id);
  }
}

module.exports = new UserService();
