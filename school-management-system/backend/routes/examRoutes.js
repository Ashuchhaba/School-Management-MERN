const express = require('express');
const router = express.Router();
const { 
    saveMarks, 
    getMarks, 
    getMyMarks,
    createExamSchedule,
    getExamSchedule,
    deleteExamSchedule,
    getMySchedule
} = require('../controllers/examController');
const { staff } = require('../middleware/staffMiddleware');

router.get('/my-marks', getMyMarks);
router.get('/my-schedule', getMySchedule);
router.post('/marks/save', staff, saveMarks);
router.get('/marks', staff, getMarks);

// Exam Schedule Routes
router.post('/schedule', staff, createExamSchedule);
router.get('/schedule', getExamSchedule);
router.delete('/schedule/:id', staff, deleteExamSchedule);

module.exports = router;
