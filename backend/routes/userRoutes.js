const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, updatePassword, resetPassword, deleteAccount } = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

router.get('/profile/:userID', getUserProfile);
router.put('/profile/:userID', authenticate, updateUserProfile);
router.put('/profile/:userID/password', authenticate, updatePassword);
router.post('/reset-password', resetPassword)
router.delete('/detele-account', authenticate, deleteAccount)

module.exports = router;
