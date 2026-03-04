const express = require('express');
const router = express.Router();
const { 
  getOrCreateChat, 
  getMyChats, 
  getChatMessages,
  getStaffListForChat,
  markMessagesAsRead 
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/get-or-create', getOrCreateChat);
router.get('/', getMyChats);
router.get('/messages/:chatId', getChatMessages);
router.get('/staff-list', getStaffListForChat);
router.put('/read/:chatId', markMessagesAsRead);

module.exports = router;
