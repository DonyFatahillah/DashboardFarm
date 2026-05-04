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

module.exports = router;
