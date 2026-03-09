const pakanService = require('../services/pakanService');
const { pakanSchema } = require('../utils/validation');
const { successResponse } = require('../utils/response');

class PakanController {
  async create(req, res, next) {
    try {
      const validated = pakanSchema.parse(req.body);
      const data = await pakanService.create(validated);
      return successResponse(res, 'Pakan recorded', data, 201);
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
      const data = await pakanService.getByFilters(filters);
      return successResponse(res, 'Pakan retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PakanController();
