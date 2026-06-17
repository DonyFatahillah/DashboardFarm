const healthService = require('../services/healthService');
const { successResponse } = require('../utils/response');

class HealthController {
  async create(req, res, next) {
    try {
      const data = await healthService.create(req.body);
      return successResponse(res, 'Reminder created', data, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await healthService.getAll();
      return successResponse(res, 'Reminders retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HealthController();
