const express = require('express');
const router = express.Router();
const penjualanController = require('../controllers/penjualanController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.use(verifyToken);

router.post('/', authorizeRoles('OWNER', 'MANAGER'), penjualanController.create);
router.get('/', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), penjualanController.getByFilters);

module.exports = router;
