const express = require('express');
const router = express.Router();
const {
    getNotices,
    createNotice,
    updateNotice,
    deleteNotice
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Get all notices (Accessible by authenticated users)
router.get('/', protect, getNotices);

// Admin only routes
router.post('/', protect, admin, createNotice);
router.put('/:id', protect, admin, updateNotice);
router.delete('/:id', protect, admin, deleteNotice);

module.exports = router;
