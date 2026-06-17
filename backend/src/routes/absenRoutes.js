const express = require('express');
const router = express.Router();
const absenController = require('../controllers/absenController');
const { verifyToken } = require('../middlewares/auth');

router.use(verifyToken);
router.post('/', absenController.create);
router.get('/', absenController.getAll);

module.exports = router;
