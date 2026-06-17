const express = require('express');
const router = express.Router();
const pupukController = require('../controllers/pupukController');

router.post('/', pupukController.create);
router.get('/', pupukController.getAll);

module.exports = router;
