const dashboardRepository = require('../repositories/dashboardRepository');

class DashboardService {
  async getSummary() {
    return await dashboardRepository.getSummary();
  }
  
  async getProductionChart() {
    return await dashboardRepository.getProductionChart();
  }
  
  async getProductionByKandang() {
      return await dashboardRepository.getProductionByKandang();
  }
}

module.exports = new DashboardService();
