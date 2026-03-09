const penjualanService = require('../services/penjualanService');
const { penjualanSchema } = require('../utils/validation');
const { successResponse } = require('../utils/response');

class PenjualanController {
  async create(req, res, next) {
    try {
      const validated = penjualanSchema.parse(req.body);
      const data = await penjualanService.create(validated);
      return successResponse(res, 'Penjualan recorded', data, 201);
    } catch (error) {
      next(error);
    }
  }

  async getByFilters(req, res, next) {
    try {
      const filters = {
        start: req.query.start,
        end: req.query.end,
      };
      const data = await penjualanService.getByFilters(filters);
      return successResponse(res, 'Penjualan retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PenjualanController();
