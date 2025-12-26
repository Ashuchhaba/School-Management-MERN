const Leave = require('../models/leaveModel');
const logger = require('../config/logger');

// @desc    Get all leave applications for the logged-in staff
// @route   GET /api/leave
// @access  Private (Staff)
const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ staff_id: req.session.user.id });
        res.json(leaves);
    } catch (error) {
        logger.error('Error fetching leaves:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Apply for leave
// @route   POST /api/leave/apply
// @access  Private (Staff)
const applyLeave = async (req, res) => {
    try {
        const { reason, startDate, endDate } = req.body;
        const staff_id = req.session.user.id;

        const leave = new Leave({
            staff_id,
            reason,
            startDate,
            endDate,
        });

        const createdLeave = await leave.save();
        res.status(201).json(createdLeave);
    } catch (error) {
        logger.error('Error applying for leave:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getLeaves,
    applyLeave,
};
