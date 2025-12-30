const Staff = require('../models/staffModel');
const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Salary = require('../models/salaryModel');
const StudentAttendance = require('../models/studentAttendanceModel');
const logger = require('../config/logger');
const crypto = require('crypto');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private (Admin)
const getStaffs = async (req, res) => {
    try {
        const staffs = await Staff.find({});
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
        const staff = await Staff.findById(req.params.id);
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
        const { email, name, mobile_no } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const staff = new Staff({
            ...req.body,
        });
        const createdStaff = await staff.save();

        // Generate temporary password
        const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 characters

        // Create User account
        const user = new User({
            username: email, // Use email as username
            email: email,
            password: tempPassword, // Will be hashed by pre-save hook
            role: 'staff',
            referenceId: createdStaff._id,
            isFirstLogin: true,
        });

        await user.save();

        res.status(201).json({
            staff: createdStaff,
            tempPassword: tempPassword
        });
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

            // Sync status with User account if changed
            if (req.body.is_active !== undefined) {
                 await User.updateOne(
                    { referenceId: staff._id },
                    { status: req.body.is_active }
                 );
            }

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
            // Delete associated user
            await User.deleteOne({ referenceId: staff._id });
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
    const staff = await Staff.findById(req.session.user.linkedId);
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
        const staff = await Staff.findById(req.session.user.linkedId);
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
        const staffId = req.session.user.linkedId;
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
        // Find User by ID (stored in session)
        const user = await User.findById(req.session.user.id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            user.isFirstLogin = false; // Disable flag after password change
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).send('Invalid current password');
        }
    } catch (error) {
        logger.error(`Error changing password for user ID: ${req.session.user.id}`, error);
        res.status(500).send('Server error');
    }
};

// @desc    Reset staff password (Admin only)
// @route   PUT /api/staff/:id/reset-password
// @access  Private (Admin)
const resetStaffPassword = async (req, res) => {
    try {
        const staffId = req.params.id;
        logger.info(`Attempting to reset password for staffId: ${staffId}`);

        const staff = await Staff.findById(staffId);
        
        if (!staff) {
            logger.warn(`Staff not found for ID: ${staffId}`);
            return res.status(404).json({ message: 'Staff not found' });
        }

        // 1. Try to find user by linked Reference ID
        let user = await User.findOne({ referenceId: staffId });
        
        // Generate new random password
        const newPassword = crypto.randomBytes(4).toString('hex'); // 8 characters

        if (!user) {
            // 2. If not found by link, try to find by Email (orphan account recovery)
            user = await User.findOne({ email: staff.email });

            if (user) {
                // Found a user with this email but not linked (or linked to old). Re-link it.
                logger.info(`Found unlinked user account for ${staff.email}. Re-linking to staff ${staffId}.`);
                user.referenceId = staff._id;
                user.role = 'staff'; // Ensure role is staff
                // Proceed to update password below
            } else {
                // 3. No user found at all. Check for username conflict before creating.
                const usernameTaken = await User.findOne({ username: staff.email });
                if (usernameTaken) {
                     return res.status(400).json({ message: `The username ${staff.email} is already taken by another account.` });
                }

                // Create User account
                user = new User({
                    username: staff.email,
                    email: staff.email,
                    password: newPassword,
                    role: 'staff',
                    referenceId: staff._id,
                    isFirstLogin: true,
                    status: true
                });
                logger.info(`Created missing user account for staff ${staff.name} during password reset`);
                await user.save();
                
                return res.json({ 
                    message: 'Password reset successfully (New Account Created)', 
                    newPassword: newPassword 
                });
            }
        }
        
        // Update existing (or found) user password
        user.password = newPassword; 
        user.isFirstLogin = true; 
        await user.save();

        logger.info(`Password reset for staff ${staff.name} (User: ${user.username}) by Admin`);

        res.json({ 
            message: 'Password reset successfully', 
            newPassword: newPassword 
        });

    } catch (error) {
        logger.error('Error resetting staff password:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A user with this email/username already exists.' });
        }
        res.status(500).json({ message: 'Server Error' });
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
  resetStaffPassword,
};
