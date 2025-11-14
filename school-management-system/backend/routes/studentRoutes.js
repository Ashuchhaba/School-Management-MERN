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
} = require('../controllers/studentController');

router.route('/').get(getStudents).post(createStudent);
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);
router.route('/count-by-class').get(getStudentCountByClass);
router.route('/approve').post(approveAdmission);

module.exports = router;
