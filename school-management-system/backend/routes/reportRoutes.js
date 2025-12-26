const express = require('express');
const router = express.Router();
const {
  getStudentReport,
  getStaffReport,
  getStudentFeesReport,
  getStaffSalaryReport,
  getStudentAttendanceReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/students').get(protect, admin, getStudentReport);
router.route('/staff').get(protect, admin, getStaffReport);
router.route('/fees').get(protect, admin, getStudentFeesReport);
router.route('/salaries').get(protect, admin, getStaffSalaryReport);
router.route('/attendance').get(protect, admin, getStudentAttendanceReport);

module.exports = router;
