const pupukRepository = require('../repositories/pupukRepository');

class PupukService {
  async create(data) {
    return await pupukRepository.create(data);
  }

  async getAll() {
    return await pupukRepository.getAll();
  }
}

module.exports = new PupukService();
