const penjualanRepository = require('../repositories/penjualanRepository');

class PenjualanService {
  async create(data) {
    return await penjualanRepository.create(data);
  }

  async getByFilters(filters) {
    const { start, end } = filters;
    return await penjualanRepository.findByFilters(start, end);
  }
}

module.exports = new PenjualanService();
