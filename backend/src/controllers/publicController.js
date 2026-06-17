const dashboardService = require('../services/dashboardService');
const telurRusakService = require('../services/telurRusakService');
const pupukService = require('../services/pupukService');
const { successResponse } = require('../utils/response');

class PublicController {
  async getPublicStats(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      const charts = await dashboardService.getProductionChart();
      const telurRusakData = await telurRusakService.getSummary();
      const pupukData = await pupukService.getAll();
      
      const totalTelurRusak = telurRusakData.reduce((acc, curr) => acc + parseInt(curr.total_rusak || 0), 0);
      const totalPupukTerjual = pupukData.reduce((acc, curr) => acc + parseInt(curr.jumlah_karung || 0), 0);
      
      const publicData = {
        totalPupukTerjual: totalPupukTerjual,
        totalTelurRusak: totalTelurRusak,
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
