const express = require('express');
const { getCreditCard } = require('../controllers/creditCardController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.post('/get-credit-card', authenticate, getCreditCard);

module.exports = router;
