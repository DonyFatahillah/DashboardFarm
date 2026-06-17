const express = require('express');
const router = express.Router();
const telurRusakController = require('../controllers/telurRusakController');

router.post('/', telurRusakController.create);
router.get('/summary', telurRusakController.getSummary);

module.exports = router;
