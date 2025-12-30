const express = require('express');
const router = express.Router();
const { 
    getMySalaries, 
    getSalaries, 
    getSalaryStats, 
    calculateAllSalaries, 
    updateSalary, 
    deleteSalary,
    getStaffAttendanceByMonth,
    saveBulkAttendance,
    createSalary
} = require('../controllers/salaryController');
const { staff } = require('../middleware/staffMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', admin, getSalaries);
router.get('/stats', admin, getSalaryStats);
router.get('/attendance/:staffId/:month', admin, getStaffAttendanceByMonth);
router.post('/bulk-attendance', admin, saveBulkAttendance);
router.post('/calculate-all', admin, calculateAllSalaries);
router.post('/', admin, createSalary);

router.get('/mine', staff, getMySalaries);
router.put('/:id', admin, updateSalary);
router.delete('/:id', admin, deleteSalary);

module.exports = router;