const produksiRepository = require('../repositories/produksiRepository');

class ProduksiService {
  async create(data) {
    return await produksiRepository.create(data);
  }

  async getByFilters(filters) {
    const { kandang_id, start, end } = filters;
    return await produksiRepository.findByFilters(kandang_id, start, end);
  }
}

module.exports = new ProduksiService();
