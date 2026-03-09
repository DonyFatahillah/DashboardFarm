const express = require('express');
const router = express.Router();
const produksiController = require('../controllers/produksiController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.use(verifyToken);

router.post('/', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), produksiController.create);
router.get('/', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), produksiController.getByFilters);

module.exports = router;
