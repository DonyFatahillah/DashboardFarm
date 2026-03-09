const express = require('express');
const router = express.Router();
const pakanController = require('../controllers/pakanController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.use(verifyToken);

router.post('/', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), pakanController.create);
router.get('/', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), pakanController.getByFilters);

module.exports = router;
