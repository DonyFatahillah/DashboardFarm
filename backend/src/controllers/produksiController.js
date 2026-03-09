const produksiService = require('../services/produksiService');
const { produksiSchema } = require('../utils/validation');
const { successResponse } = require('../utils/response');

class ProduksiController {
  async create(req, res, next) {
    try {
      const validated = produksiSchema.parse(req.body);
      const data = await produksiService.create(validated);
      return successResponse(res, 'Produksi recorded', data, 201);
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
      const data = await produksiService.getByFilters(filters);
      return successResponse(res, 'Produksi retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProduksiController();
