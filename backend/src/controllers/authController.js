const authService = require('../services/authService');
const { loginSchema } = require('../utils/validation');
const { successResponse } = require('../utils/response');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const data = await authService.login(username, password);
      return successResponse(res, 'Login successful', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
