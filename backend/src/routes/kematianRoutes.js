const express = require('express');
const router = express.Router();
const kematianController = require('../controllers/kematianController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.use(verifyToken);

router.post('/', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), kematianController.create);
router.get('/', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), kematianController.getByFilters);

module.exports = router;
