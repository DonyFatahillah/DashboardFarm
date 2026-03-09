const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.use(verifyToken);

router.get('/summary', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), dashboardController.getSummary);
router.get('/charts', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), dashboardController.getCharts);

module.exports = router;
