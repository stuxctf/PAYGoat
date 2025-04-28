const express = require('express');
const { registerAlias, getSavedRecipients, transferFundsUUID} = require('../controllers/paymentUUIDController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.post('/transferFundsUuid', authenticate, transferFundsUUID);
router.post('/register-alias', authenticate,  registerAlias);
router.get('/saved-recipients', authenticate, getSavedRecipients);

module.exports = router;