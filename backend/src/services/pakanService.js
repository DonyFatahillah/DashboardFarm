const pakanRepository = require('../repositories/pakanRepository');

class PakanService {
  async create(data) {
    return await pakanRepository.create(data);
  }

  async getByFilters(filters) {
    const { kandang_id, start, end } = filters;
    return await pakanRepository.findByFilters(kandang_id, start, end);
  }
}

module.exports = new PakanService();
