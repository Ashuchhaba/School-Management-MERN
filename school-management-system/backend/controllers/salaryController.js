const Salary = require('../models/salaryModel');
const logger = require('../config/logger');

// @desc    Get all salary details for the logged-in staff
// @route   GET /api/salaries/mine
// @access  Private (Staff)
const getMySalaries = async (req, res) => {
    try {
        const salaries = await Salary.find({ staff_id: req.session.user.id });
        res.json(salaries);
    } catch (error) {
        logger.error('Error fetching staff salaries:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMySalaries,
};
