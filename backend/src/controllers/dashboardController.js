const dashboardService = require('../services/dashboardService');
const { successResponse } = require('../utils/response');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const data = await dashboardService.getSummary();
      return successResponse(res, 'Summary retrieved', data);
    } catch (error) {
      next(error);
    }
  }
  
  async getCharts(req, res, next) {
      try {
          const production = await dashboardService.getProductionChart();
          const productionByKandang = await dashboardService.getProductionByKandang();
          return successResponse(res, 'Charts retrieved', {
              production,
              productionByKandang
          });
      } catch (error) {
          next(error);
      }
  }
}

module.exports = new DashboardController();
