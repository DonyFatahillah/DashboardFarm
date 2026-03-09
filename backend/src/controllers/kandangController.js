const kandangService = require('../services/kandangService');
const { kandangSchema } = require('../utils/validation');
const { successResponse } = require('../utils/response');

class KandangController {
  async getAll(req, res, next) {
    try {
      const data = await kandangService.getAll();
      return successResponse(res, 'Kandang retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const validated = kandangSchema.parse(req.body);
      const data = await kandangService.create(validated);
      return successResponse(res, 'Kandang created', data, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const validated = kandangSchema.parse(req.body);
      const data = await kandangService.update(req.params.id, validated);
      return successResponse(res, 'Kandang updated', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await kandangService.delete(req.params.id);
      return successResponse(res, 'Kandang deleted');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new KandangController();
