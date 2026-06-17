const telurRusakService = require('../services/telurRusakService');
const { successResponse } = require('../utils/response');

class TelurRusakController {
  async create(req, res, next) {
    try {
      const data = await telurRusakService.create(req.body);
      return successResponse(res, 'Record created', data, 201);
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req, res, next) {
    try {
      const data = await telurRusakService.getSummary();
      return successResponse(res, 'Summary retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TelurRusakController();
