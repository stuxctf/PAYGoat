const express = require('express');
const router = express.Router();
const { getAccountDetails, getTransactionHistory } = require('../controllers/accountController');
const authenticate = require('../middlewares/authenticate');

router.post('/account', getAccountDetails);
router.get('/transactions/history', authenticate, getTransactionHistory);

module.exports = router;
