const express = require('express');
const router = express.Router();
const {
    getStaffs,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffProfile,
    getAssignedStudents,
    getDashboardStats,
    changePassword
} = require('../controllers/staffController');
const { admin } = require('../middleware/adminMiddleware');
const { staff } = require('../middleware/staffMiddleware');

// Staff route for profile
router.get('/profile', staff, getStaffProfile);

// Staff route for assigned students
router.get('/students', staff, getAssignedStudents);

// Staff route for dashboard stats
router.get('/dashboard-stats', staff, getDashboardStats);

// Staff route for changing password
router.put('/change-password', staff, changePassword);

// Admin routes for staff management
router.route('/').get(admin, getStaffs).post(admin, createStaff);
router.route('/:id').get(admin, getStaffById).put(admin, updateStaff).delete(admin, deleteStaff);

module.exports = router;