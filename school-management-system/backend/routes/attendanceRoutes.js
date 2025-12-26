const express = require('express');
const router = express.Router();
const { getAttendanceByClass, saveAttendance } = require('../controllers/attendanceController');
const { staff } = require('../middleware/staffMiddleware');

router.get('/class/:class', staff, getAttendanceByClass);
router.post('/save', staff, saveAttendance);

module.exports = router;
