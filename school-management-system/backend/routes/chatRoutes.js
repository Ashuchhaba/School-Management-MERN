const express = require('express');
const router = express.Router();
const { 
  getOrCreateChat, 
  getMyChats, 
  getChatMessages,
  getStaffListForChat,
  markMessagesAsRead,
  editMessage,
  deleteMessage 
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/get-or-create', getOrCreateChat);
router.get('/', getMyChats);
router.get('/messages/:chatId', getChatMessages);
router.get('/staff-list', getStaffListForChat);
router.put('/read/:chatId', markMessagesAsRead);
router.put('/message/:messageId', editMessage);
router.delete('/message/:messageId', deleteMessage);

module.exports = router;
