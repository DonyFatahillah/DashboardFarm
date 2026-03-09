const kematianService = require('../services/kematianService');
const { kematianSchema } = require('../utils/validation');
const { successResponse } = require('../utils/response');

class KematianController {
  async create(req, res, next) {
    try {
      const validated = kematianSchema.parse(req.body);
      const data = await kematianService.create(validated);
      return successResponse(res, 'Kematian recorded', data, 201);
    } catch (error) {
      next(error);
    }
  }

  async getByFilters(req, res, next) {
    try {
      const filters = {
        kandang_id: req.query.kandang_id,
        start: req.query.start,
        end: req.query.end,
      };
      const data = await kematianService.getByFilters(filters);
      return successResponse(res, 'Kematian retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new KematianController();
