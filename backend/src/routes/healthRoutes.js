const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.post('/', healthController.create);
router.get('/', healthController.getAll);

module.exports = router;
