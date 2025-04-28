const express = require('express');
const { requestLoan, getUserLoans } = require('../controllers/userLoansController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.post('/loan/request', authenticate, requestLoan);
router.get('/loan/user', authenticate, getUserLoans);

module.exports = router;