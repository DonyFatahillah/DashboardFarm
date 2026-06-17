const absenRepository = require('../repositories/absenRepository');

class AbsenService {
  async create(data) {
    return await absenRepository.create(data);
  }

  async getAll() {
    return await absenRepository.getAll();
  }
}

module.exports = new AbsenService();
