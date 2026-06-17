const pupukService = require('../services/pupukService');
const { successResponse } = require('../utils/response');

class PupukController {
  async create(req, res, next) {
    try {
      const data = await pupukService.create(req.body);
      return successResponse(res, 'Sale recorded', data, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await pupukService.getAll();
      return successResponse(res, 'Sales retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PupukController();
