const Staff = require('../models/staffModel');
const Student = require('../models/studentModel');
const Salary = require('../models/salaryModel');
const StudentAttendance = require('../models/studentAttendanceModel');
const logger = require('../config/logger');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private (Admin)
const getStaffs = async (req, res) => {
    try {
        const staffs = await Staff.find({}).select('-password');
        res.json(staffs);
    } catch (error) {
        logger.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get staff by ID
// @route   GET /api/staff/:id
// @access  Private (Admin)
const getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id).select('-password');
        if (staff) {
            res.json(staff);
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        logger.error('Error fetching staff by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a staff
// @route   POST /api/staff
// @access  Private (Admin)
const createStaff = async (req, res) => {
    try {
        const staff = new Staff({
            ...req.body,
        });
        const createdStaff = await staff.save();
        res.status(201).json(createdStaff);
    } catch (error) {
        logger.error('Error creating staff:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a staff
// @route   PUT /api/staff/:id
// @access  Private (Admin)
const updateStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (staff) {
            // Update fields
            for (const key in req.body) {
                staff[key] = req.body[key];
            }
            const updatedStaff = await staff.save();
            res.json(updatedStaff);
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        logger.error('Error updating staff:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a staff
// @route   DELETE /api/staff/:id
// @access  Private (Admin)
const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (staff) {
            await staff.deleteOne();
            res.json({ message: 'Staff removed' });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        logger.error('Error deleting staff:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get staff profile
// @route   GET /api/staff/profile
// @access  Private (Staff)
const getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.session.user.id).select('-password');
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).send('Staff not found');
    }
  } catch (error) {
    logger.error(`Error fetching staff profile for user ID: ${req.session.user.id}`, error);
    res.status(500).send('Server error');
  }
};

// @desc    Get students of assigned classes for the logged-in staff
// @route   GET /api/staff/students
// @access  Private (Staff)
const getAssignedStudents = async (req, res) => {
    try {
        const staff = await Staff.findById(req.session.user.id);
        if (!staff) {
            return res.status(404).send('Staff not found');
        }

        const students = await Student.find({ class: { $in: staff.assigned_classes } });
        res.json(students);
    } catch (error) {
        logger.error(`Error fetching assigned students for staff ID: ${req.session.user.id}`, error);
        res.status(500).send('Server error');
    }
};

// @desc    Get dashboard stats for logged-in staff
// @route   GET /api/staff/dashboard-stats
// @access  Private (Staff)
const getDashboardStats = async (req, res) => {
    try {
        const staffId = req.session.user.id;
        const staff = await Staff.findById(staffId);

        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        const assignedClasses = staff.assigned_classes || [];
        
        // Total Students in assigned classes
        const totalStudents = await Student.countDocuments({ class: { $in: assignedClasses } });

        // Attendance Today (Present)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const attendanceToday = await StudentAttendance.countDocuments({
            class: { $in: assignedClasses },
            date: { $gte: startOfDay, $lte: endOfDay },
            status: 'Present'
        });

        // Last Salary
        const lastSalaryRecord = await Salary.findOne({ staff_id: staffId }).sort({ payment_month: -1 });
        const lastSalary = lastSalaryRecord ? lastSalaryRecord.calculated_salary : 0;

        res.json({
            assignedClasses: assignedClasses.length,
            totalStudents,
            attendanceToday,
            lastSalary
        });

    } catch (error) {
        logger.error(`Error fetching dashboard stats for staff ID: ${req.session.user.id}`, error);
        res.status(500).send('Server error');
    }
};

// @desc    Change staff password
// @route   PUT /api/staff/change-password
// @access  Private (Staff)
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const staff = await Staff.findById(req.session.user.id);

        if (staff && (await staff.matchPassword(currentPassword))) {
            staff.password = newPassword;
            await staff.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).send('Invalid current password');
        }
    } catch (error) {
        logger.error(`Error changing password for staff ID: ${req.session.user.id}`, error);
        res.status(500).send('Server error');
    }
};

module.exports = {
  getStaffs,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffProfile,
  getAssignedStudents,
  getDashboardStats,
  changePassword,
};
