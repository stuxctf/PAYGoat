const express = require('express');
const router = express.Router();
const sendOTP = require('../controllers/otpController');

router.post('/send', sendOTP);

module.exports = router;
