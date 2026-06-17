const absenService = require('../services/absenService');
const { successResponse } = require('../utils/response');

class AbsenController {
  async create(req, res, next) {
    try {
      const data = await absenService.create(req.body);
      return successResponse(res, 'Attendance recorded', data, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await absenService.getAll();
      return successResponse(res, 'Attendance list retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AbsenController();
