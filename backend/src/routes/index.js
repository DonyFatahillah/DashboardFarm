const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const publicRoutes = require('./publicRoutes');
const kandangRoutes = require('./kandangRoutes');
const produksiRoutes = require('./produksiRoutes');
const kematianRoutes = require('./kematianRoutes');
const pakanRoutes = require('./pakanRoutes');
const penjualanRoutes = require('./penjualanRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const userRoutes = require('./userRoutes');
const aiRoutes = require('./aiRoutes');
const healthRoutes = require('./healthRoutes');
const telurRusakRoutes = require('./telurRusakRoutes');
const absenRoutes = require('./absenRoutes');
const pupukRoutes = require('./pupukRoutes');

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/kandang', kandangRoutes);
router.use('/produksi', produksiRoutes);
router.use('/kematian', kematianRoutes);
router.use('/pakan', pakanRoutes);
router.use('/penjualan', penjualanRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/ai', aiRoutes);
router.use('/health', healthRoutes);
router.use('/telur-rusak', telurRusakRoutes);
router.use('/absen', absenRoutes);
router.use('/pupuk', pupukRoutes);

module.exports = router;
