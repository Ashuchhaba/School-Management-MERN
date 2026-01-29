const express = require('express');
const router = express.Router();
const { getAttendanceByClass, saveAttendance, getMyAttendance } = require('../controllers/attendanceController');
const { staff } = require('../middleware/staffMiddleware');

router.get('/my-attendance', getMyAttendance);
router.get('/class/:class', staff, getAttendanceByClass);
router.post('/save', staff, saveAttendance);

module.exports = router;
