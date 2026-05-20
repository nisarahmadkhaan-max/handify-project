const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Protected routes for 1-to-1 chat
router.post('/send', auth, chatController.sendMessage);
router.get('/messages', auth, chatController.getMessages);

module.exports = router;