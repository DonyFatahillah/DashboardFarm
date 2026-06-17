const userService = require('../services/userService');
const { userCreateSchema } = require('../utils/validation');
const { successResponse } = require('../utils/response');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return successResponse(res, 'Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  }

  async findByName(req, res, next) {
    try {
      const { username } = req.query;
      const user = await userService.findByName(username);
      return successResponse(res, 'User found', user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const validatedData = userCreateSchema.parse(req.body);
      const user = await userService.createUser(validatedData);
      return successResponse(res, 'User created successfully', user, 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      return successResponse(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
