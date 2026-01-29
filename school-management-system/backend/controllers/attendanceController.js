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
        // Use linkedId because 'marked_by' refers to Staff model, not User model
        const marked_by = req.session.user.linkedId; 

        if (!marked_by) {
             return res.status(400).json({ message: 'Staff ID not found in session.' });
        }

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

        if (operations.length > 0) {
            await StudentAttendance.bulkWrite(operations);
        }
        
        res.status(200).json({ message: 'Attendance saved successfully' });
    } catch (error) {
        logger.error('Error saving attendance:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get attendance for logged-in student
// @route   GET /api/attendance/my-attendance
// @access  Private (Student)
const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.session.user.linkedId;
        const { month } = req.query; // YYYY-MM

        logger.info(`Fetching attendance for student: ${studentId}, Month: ${month}`);

        let query = { student_id: studentId };

        if (month) {
            const year = parseInt(month.split('-')[0]);
            const monthIndex = parseInt(month.split('-')[1]) - 1;
            // Use UTC dates to cover the whole month regardless of timezone
            const startDate = new Date(Date.UTC(year, monthIndex, 1));
            const endDate = new Date(Date.UTC(year, monthIndex + 1, 0));
            endDate.setUTCHours(23, 59, 59, 999);
            
            query.date = { $gte: startDate, $lte: endDate };
            logger.info(`Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
        }

        const attendance = await StudentAttendance.find(query).sort({ date: -1 });
        logger.info(`Found ${attendance.length} records.`);
        res.json(attendance);
    } catch (error) {
        logger.error('Error fetching student attendance:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAttendanceByClass,
    saveAttendance,
    getMyAttendance
};
