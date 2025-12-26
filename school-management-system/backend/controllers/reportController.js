const Student = require('../models/studentModel');
const Staff = require('../models/staffModel');
const Fee = require('../models/feeModel');
const Salary = require('../models/salaryModel');
const Attendance = require('../models/attendanceModel');

// @desc    Get student report
// @route   GET /api/reports/students
// @access  Private/Admin
const getStudentReport = async (req, res) => {
  try {
    // Filtering logic will be added here
    const students = await Student.find(req.query).lean();
    const formattedStudents = students.map(student => ({
      ...student,
      rollNo: student.roll_no,
      mobile: student.mobile_no1,
      admissionDate: student.admission_date,
    }));
    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get staff report
// @route   GET /api/reports/staff
// @access  Private/Admin
const getStaffReport = async (req, res) => {
  try {
    // Filtering logic will be added here
    const staff = await Staff.find(req.query).lean();
    const formattedStaff = staff.map(member => ({
      ...member,
      staffId: member._id,
      department: member.designation,
      mobile: member.mobile_no,
      joiningDate: member.date_of_join,
    }));
    res.json(formattedStaff);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get student fees report
// @route   GET /api/reports/fees
// @access  Private/Admin
const getStudentFeesReport = async (req, res) => {
  try {
    // Filtering logic will be added here
    const fees = await Fee.find(req.query).populate('student');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get staff salary report
// @route   GET /api/reports/salaries
// @access  Private/Admin
const getStaffSalaryReport = async (req, res) => {
  try {
    // Filtering logic will be added here
    const salaries = await Salary.find(req.query).populate('staff');
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get student attendance report
// @route   GET /api/reports/attendance
// @access  Private/Admin
const getStudentAttendanceReport = async (req, res) => {
  try {
    // Filtering logic will be added here
    const attendance = await Attendance.find(req.query).populate('student');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStudentReport,
  getStaffReport,
  getStudentFeesReport,
  getStaffSalaryReport,
  getStudentAttendanceReport,
};
