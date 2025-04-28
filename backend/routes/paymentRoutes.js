const express = require('express');
const { transferFunds, transferttirdparties } = require('../controllers/paymentController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();


router.post('/transfer', transferFunds);
router.post('/transferthirdparties', authenticate, transferttirdparties);

module.exports = router;