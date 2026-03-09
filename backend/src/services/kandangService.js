const kandangRepository = require('../repositories/kandangRepository');

class KandangService {
  async getAll() {
    return await kandangRepository.findAll();
  }

  async getById(id) {
    const kandang = await kandangRepository.findById(id);
    if (!kandang) {
      throw { statusCode: 404, message: 'Kandang not found' };
    }
    return kandang;
  }

  async create(data) {
    return await kandangRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id); // Ensure exists
    return await kandangRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id); // Ensure exists
    return await kandangRepository.delete(id);
  }
}

module.exports = new KandangService();
