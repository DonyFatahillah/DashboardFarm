const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const kandangRoutes = require('./kandangRoutes');
const produksiRoutes = require('./produksiRoutes');
const kematianRoutes = require('./kematianRoutes');
const pakanRoutes = require('./pakanRoutes');
const penjualanRoutes = require('./penjualanRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/auth', authRoutes);
router.use('/kandang', kandangRoutes);
router.use('/produksi', produksiRoutes);
router.use('/kematian', kematianRoutes);
router.use('/pakan', pakanRoutes);
router.use('/penjualan', penjualanRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
