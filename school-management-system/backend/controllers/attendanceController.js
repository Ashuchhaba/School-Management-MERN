const StudentAttendance = require('../models/studentAttendanceModel');
const logger = require('../config/logger');

// @desc    Get attendance for a class on a specific date
// @route   GET /api/attendance/class/:class
// @access  Private (Staff)
const getAttendanceByClass = async (req, res) => {
    try {
        const { date } = req.query;
        const { class: className } = req.params;

        const attendance = await StudentAttendance.find({
            class: className,
            date: new Date(date),
        });
        res.json(attendance);
    } catch (error) {
        logger.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Save attendance for a class
// @route   POST /api/attendance/save
// @access  Private (Staff)
const saveAttendance = async (req, res) => {
    try {
        const { class: className, date, attendance } = req.body;
        const marked_by = req.session.user.id;

        const operations = Object.keys(attendance).map(student_id => ({
            updateOne: {
                filter: { student_id, date: new Date(date) },
                update: {
                    $set: {
                        status: attendance[student_id],
                        class: className,
                        marked_by,
                    },
                },
                upsert: true,
            },
        }));

        await StudentAttendance.bulkWrite(operations);
        res.status(200).json({ message: 'Attendance saved successfully' });
    } catch (error) {
        logger.error('Error saving attendance:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAttendanceByClass,
    saveAttendance,
};
