const Notice = require('../models/noticeModel');
const logger = require('../config/logger');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private (Admin/Staff/Student)
const getNotices = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type) {
            query.type = type;
        }
        const notices = await Notice.find(query).sort({ date: -1 });
        res.json(notices);
    } catch (error) {
        logger.error('Error fetching notices:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get public news
// @route   GET /api/notices/news
// @access  Public
const getPublicNews = async (req, res) => {
    try {
        const news = await Notice.find({ type: 'news' }).sort({ date: -1 }).limit(10);
        res.json(news);
    } catch (error) {
        logger.error('Error fetching public news:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private (Admin)
const createNotice = async (req, res) => {
    logger.info(`Create Notice Request. Session ID: ${req.sessionID}`);
    if (req.session.user) {
        logger.info(`User from session: ${JSON.stringify(req.session.user)}`);
    } else {
        logger.warn('No user in session during createNotice');
    }

    try {
        const { title, content, target_audience, type } = req.body;
        
        const notice = new Notice({
            title,
            content,
            target_audience: target_audience || 'all',
            type: type || 'notice',
            posted_by: req.session.user ? (req.session.user.name || 'Admin') : 'Admin',
            date: new Date()
        });

        const createdNotice = await notice.save();
        res.status(201).json(createdNotice);
    } catch (error) {
        logger.error('Error creating notice:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private (Admin)
const updateNotice = async (req, res) => {
    try {
        const { title, content, target_audience, type } = req.body;
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            notice.title = title || notice.title;
            notice.content = content || notice.content;
            notice.target_audience = target_audience || notice.target_audience;
            notice.type = type || notice.type;

            const updatedNotice = await notice.save();
            res.json(updatedNotice);
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        logger.error('Error updating notice:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin)
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (notice) {
            await notice.deleteOne();
            res.json({ message: 'Notice removed' });
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        logger.error('Error deleting notice:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNotices,
    getPublicNews,
    createNotice,
    updateNotice,
    deleteNotice
};
