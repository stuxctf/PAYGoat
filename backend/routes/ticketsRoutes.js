const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authenticate = require('../middlewares/authenticate');

router.post('/conversation', authenticate, ticketController.createConversation);
router.get('/my-conversations', authenticate, ticketController.getUserConversations);
router.get('/conversation/:id', authenticate, ticketController.getConversationWithComments);
router.post('/conversation/:id/comment', ticketController.addComment);
router.get('/conversation/:id/comments', ticketController.getCommentsByConversation);

module.exports = router;