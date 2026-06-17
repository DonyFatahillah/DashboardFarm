const healthRepository = require('../repositories/healthRepository');

class HealthService {
  async create(data) {
    return await healthRepository.create(data);
  }

  async getAll() {
    return await healthRepository.getAll();
  }
}

module.exports = new HealthService();
