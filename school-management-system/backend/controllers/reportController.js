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

const fs = require('fs');
const path = require('path');

// @desc    Get student fees report
// @route   GET /api/reports/fees
// @access  Private/Admin
const getStudentFeesReport = async (req, res) => {
  try {
    const fees = await Fee.find(req.query).populate('student_id');
    
    const formattedFees = fees.map(fee => {
        try {
            // Check if population worked (it should be an object with a name property)
            let student = fee.student_id;
            if (!student || !student.name) {
                 student = { name: 'Unknown', class: 'N/A' };
            }

            return {
                _id: fee._id,
                studentName: student.name,
                class: student.class,
                totalFees: (fee.paid_amount || 0) + (fee.due_amount || 0),
                paidAmount: fee.paid_amount || 0,
                pendingAmount: fee.due_amount || 0,
                paymentStatus: fee.status || 'N/A',
                paymentDate: fee.payment_date
            };
        } catch (mapErr) {
            fs.appendFileSync(path.join(__dirname, '../debug_error.log'), `Mapping Error: ${mapErr.message}\n`);
            return null;
        }
    }).filter(f => f !== null); // Remove failed records

    res.json(formattedFees);
  } catch (error) {
    console.error('Error fetching fee report:', error);
    fs.appendFileSync(path.join(__dirname, '../debug_error.log'), `Controller Error: ${error.message}\nStack: ${error.stack}\n`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get staff salary report
// @route   GET /api/reports/salaries
// @access  Private/Admin
const getStaffSalaryReport = async (req, res) => {
  try {
    const salaries = await Salary.find(req.query).populate('staff_id');
    
    const formattedSalaries = salaries.map(salary => {
        const staff = salary.staff_id || { name: 'Unknown', designation: 'N/A' };
        
        return {
            _id: salary._id,
            staffName: staff.name,
            designation: staff.designation,
            month: new Date(salary.payment_month).toLocaleString('default', { month: 'long', year: 'numeric' }), // e.g., "January 2025"
            salaryAmount: salary.calculated_salary,
            paymentStatus: salary.paid_on ? 'Paid' : 'Pending',
            paymentDate: salary.paid_on || null,
            rawDate: salary.payment_month // Keep raw date for filtering if needed
        };
    });

    res.json(formattedSalaries);
  } catch (error) {
    console.error('Error fetching salary report:', error);
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
