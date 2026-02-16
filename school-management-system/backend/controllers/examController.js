const ExamMarks = require('../models/examMarksModel');
const ExamSchedule = require('../models/examScheduleModel');
const Student = require('../models/studentModel');
const logger = require('../config/logger');

// @desc    Save exam marks for a class
// @route   POST /api/exams/marks/save
// @access  Private (Staff)
const saveMarks = async (req, res) => {
    try {
        const { class: className, subject, examType, marks } = req.body;
        const marked_by = req.session.user.linkedId; // Use linkedId for Staff reference

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

        if (operations.length > 0) {
            await ExamMarks.bulkWrite(operations);
        }
        
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

// @desc    Get exam marks for logged-in student
// @route   GET /api/exams/my-marks
// @access  Private (Student)
const getMyMarks = async (req, res) => {
    try {
        const studentId = req.session.user.linkedId;
        const marks = await ExamMarks.find({ student_id: studentId }).sort({ exam_type: 1, subject: 1 });
        res.json(marks);
    } catch (error) {
        logger.error('Error fetching student marks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create exam schedule
// @route   POST /api/exams/schedule
// @access  Private (Staff)
const createExamSchedule = async (req, res) => {
    try {
        const { class: className, exam_type, subject, date, start_time, end_time } = req.body;
        
        const schedule = new ExamSchedule({
            class: className,
            exam_type,
            subject,
            date,
            start_time,
            end_time
        });

        const createdSchedule = await schedule.save();
        res.status(201).json(createdSchedule);
    } catch (error) {
        logger.error('Error creating exam schedule:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get exam schedule for a class
// @route   GET /api/exams/schedule
// @access  Private (Staff/Student)
const getExamSchedule = async (req, res) => {
    try {
        const { class: className } = req.query;
        const schedules = await ExamSchedule.find({ class: className }).sort({ date: 1, start_time: 1 });
        res.json(schedules);
    } catch (error) {
        logger.error('Error fetching exam schedule:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete exam schedule
// @route   DELETE /api/exams/schedule/:id
// @access  Private (Staff)
const deleteExamSchedule = async (req, res) => {
    try {
        const schedule = await ExamSchedule.findById(req.params.id);
        if (schedule) {
            await schedule.deleteOne();
            res.json({ message: 'Schedule removed' });
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        logger.error('Error deleting exam schedule:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get exam schedule for logged-in student
// @route   GET /api/exams/my-schedule
// @access  Private (Student)
const getMySchedule = async (req, res) => {
    try {
        const studentId = req.session.user.linkedId;
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const schedules = await ExamSchedule.find({ class: student.class }).sort({ date: 1, start_time: 1 });
        res.json(schedules);
    } catch (error) {
        logger.error('Error fetching student exam schedule:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    saveMarks,
    getMarks,
    getMyMarks,
    createExamSchedule,
    getExamSchedule,
    deleteExamSchedule,
    getMySchedule
};
