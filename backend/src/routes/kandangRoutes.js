const express = require('express');
const router = express.Router();
const kandangController = require('../controllers/kandangController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.use(verifyToken);

router.get('/', authorizeRoles('OWNER', 'MANAGER', 'STAFF'), kandangController.getAll);
router.post('/', authorizeRoles('OWNER', 'MANAGER'), kandangController.create);
router.put('/:id', authorizeRoles('OWNER', 'MANAGER'), kandangController.update);
router.delete('/:id', authorizeRoles('OWNER'), kandangController.delete);

module.exports = router;
