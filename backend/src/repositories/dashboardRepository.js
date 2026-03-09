const pool = require('../config/db');

class DashboardRepository {
  async getSummary() {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM kandang) AS total_kandang,
        (
          (SELECT COALESCE(SUM(jumlah_awal), 0) FROM batch_ayam) -
          (SELECT COALESCE(SUM(jumlah_mati), 0) FROM kematian_harian)
        ) AS total_ayam_aktif,
        (SELECT COALESCE(SUM(jumlah_telur), 0) FROM produksi_harian WHERE DATE(tanggal) = CURDATE()) AS produksi_hari_ini,
        (SELECT COALESCE(SUM(jumlah_mati), 0) FROM kematian_harian WHERE DATE(tanggal) = CURDATE()) AS kematian_hari_ini,
        (SELECT COALESCE(SUM(jumlah_kg), 0) FROM pakan_harian WHERE DATE(tanggal) = CURDATE()) AS total_pakan_hari_ini,
        (SELECT COALESCE(SUM(total_harga), 0) FROM penjualan_telur WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())) AS total_pendapatan_bulan_ini
    `;
    
    const [rows] = await pool.query(query);
    return rows[0];
  }

  async getProductionChart() {
    // Last 7 days production
    const query = `
        SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') as date, SUM(jumlah_telur) as total
        FROM produksi_harian
        WHERE tanggal >= DATE(NOW()) - INTERVAL 7 DAY
        GROUP BY DATE(tanggal)
        ORDER BY DATE(tanggal) ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }
  
  async getProductionByKandang() {
      const query = `
        SELECT k.nama as name, SUM(p.jumlah_telur) as total
        FROM produksi_harian p
        JOIN kandang k ON p.kandang_id = k.id
        WHERE p.tanggal >= DATE(NOW()) - INTERVAL 30 DAY
        GROUP BY k.id, k.nama
      `;
      const [rows] = await pool.query(query);
      return rows;
  }
}

module.exports = new DashboardRepository();
