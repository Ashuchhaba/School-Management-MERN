const ExamMarks = require('../models/examMarksModel');
const logger = require('../config/logger');

// @desc    Save exam marks for a class
// @route   POST /api/exams/marks/save
// @access  Private (Staff)
const saveMarks = async (req, res) => {
    try {
        const { class: className, subject, examType, marks } = req.body;
        const marked_by = req.session.user.id;

        const operations = Object.keys(marks).map(student_id => ({
            updateOne: {
                filter: { student_id, class: className, subject, exam_type: examType },
                update: {
                    $set: {
                        marks: marks[student_id],
                        marked_by,
                    },
                },
                upsert: true,
            },
        }));

        await ExamMarks.bulkWrite(operations);
        res.status(200).json({ message: 'Marks saved successfully' });
    } catch (error) {
        logger.error('Error saving marks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get exam marks for a class
// @route   GET /api/exams/marks
// @access  Private (Staff)
const getMarks = async (req, res) => {
    try {
        const { class: className, subject, examType } = req.query;
        const marks = await ExamMarks.find({
            class: className,
            subject,
            exam_type: examType,
        });
        res.json(marks);
    } catch (error) {
        logger.error('Error fetching marks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    saveMarks,
    getMarks,
};
