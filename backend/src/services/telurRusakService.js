const telurRusakRepository = require('../repositories/telurRusakRepository');

class TelurRusakService {
  async create(data) {
    return await telurRusakRepository.create(data);
  }

  async getSummary() {
    return await telurRusakRepository.getSummary();
  }
}

module.exports = new TelurRusakService();
