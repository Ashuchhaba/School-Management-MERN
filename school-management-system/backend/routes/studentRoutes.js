const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentCountByClass,
  approveAdmission,
  resetStudentPassword,
  getStudentDashboardStats,
  changePassword,
  getStudentProfile
} = require('../controllers/studentController');
const { admin } = require('../middleware/adminMiddleware');

// Student Dashboard Stats
router.get('/dashboard-stats', getStudentDashboardStats);

// Student Profile
router.get('/profile', getStudentProfile);

// Change Password
router.put('/change-password', changePassword);

// Admin route for resetting student password
router.put('/reset-password/:id', admin, resetStudentPassword);

router.route('/count-by-class').get(getStudentCountByClass);
router.route('/').get(getStudents).post(createStudent);
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);
router.route('/approve').post(approveAdmission);

module.exports = router;
