const dashboardService = require('../services/dashboardService');
const { successResponse } = require('../utils/response');

class PublicController {
  async getPublicStats(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      const charts = await dashboardService.getProductionChart();
      
      // Filter sensitive info if any, but summary seems okay for general stats
      const publicData = {
        totalKandang: summary.total_kandang,
        totalAyam: summary.total_ayam_aktif,
        produksiHariIni: summary.produksi_hari_ini,
        totalPakanHariIni: summary.total_pakan_hari_ini,
        pendapatanBulanIni: summary.total_pendapatan_bulan_ini,
        chartData: charts
      };
      
      return successResponse(res, 'Public stats retrieved', publicData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublicController();
