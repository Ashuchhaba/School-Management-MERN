const Homework = require('../models/homeworkModel');
const logger = require('../config/logger');

// @desc    Get all homework by the logged-in staff
// @route   GET /api/homework
// @access  Private (Staff)
const getHomeworks = async (req, res) => {
    try {
        const homeworks = await Homework.find({ createdBy: req.session.user.id });
        res.json(homeworks);
    } catch (error) {
        logger.error('Error fetching homework:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create homework
// @route   POST /api/homework
// @access  Private (Staff)
const createHomework = async (req, res) => {
    try {
        const { class: className, subject, description, dueDate } = req.body;
        const createdBy = req.session.user.id;

        const homework = new Homework({
            class: className,
            subject,
            description,
            dueDate,
            createdBy,
        });

        const createdHomework = await homework.save();
        res.status(201).json(createdHomework);
    } catch (error) {
        logger.error('Error creating homework:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getHomeworks,
    createHomework,
};
