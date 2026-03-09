const kematianRepository = require('../repositories/kematianRepository');

class KematianService {
  async create(data) {
    return await kematianRepository.create(data);
  }

  async getByFilters(filters) {
    const { kandang_id, start, end } = filters;
    return await kematianRepository.findByFilters(kandang_id, start, end);
  }
}

module.exports = new KematianService();
