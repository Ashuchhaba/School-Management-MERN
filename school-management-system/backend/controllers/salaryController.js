const Salary = require('../models/salaryModel');
const Staff = require('../models/staffModel');
const Attendance = require('../models/attendanceModel');
const logger = require('../config/logger');

// @desc    Get all salaries with filtering
// @route   GET /api/salaries
// @access  Private (Admin)
const getSalaries = async (req, res) => {
    try {
        const { month, search } = req.query;
        let query = {};

        if (month) {
            const startDate = new Date(`${month}-01`);
            const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
            query.payment_month = { $gte: startDate, $lt: endDate };
        }

        let salaries = await Salary.find(query).populate('staff_id', 'name designation salary');

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            salaries = salaries.filter(salary => 
                salary.staff_id && salary.staff_id.name.match(searchRegex)
            );
        }

        res.json(salaries);
    } catch (error) {
        logger.error('Error fetching salaries:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get salary statistics
// @route   GET /api/salaries/stats
// @access  Private (Admin)
const getSalaryStats = async (req, res) => {
    try {
        const { month } = req.query;
        let query = {};

        if (month) {
            const startDate = new Date(`${month}-01`);
            const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
            query.payment_month = { $gte: startDate, $lt: endDate };
        }

        const salaries = await Salary.find(query);

        const total_salary_due = salaries.reduce((acc, curr) => acc + (curr.calculated_salary || 0), 0);
        const total_paid = salaries.reduce((acc, curr) => curr.paid_on ? acc + (curr.calculated_salary || 0) : acc, 0);
        const staff_paid = salaries.filter(s => s.paid_on).length;
        const total_staff = salaries.length;
        
        let total_percentage = 0;
        if (total_staff > 0) {
            total_percentage = salaries.reduce((acc, curr) => {
                const percentage = curr.total_days_in_month > 0 
                    ? (curr.total_days_present / curr.total_days_in_month) * 100 
                    : 0;
                return acc + percentage;
            }, 0);
        }
        const avg_attendance_percentage = total_staff > 0 ? (total_percentage / total_staff).toFixed(1) : 0;

        res.json({
            total_salary_due,
            total_paid,
            staff_paid,
            total_staff,
            avg_attendance_percentage
        });

    } catch (error) {
        logger.error('Error fetching salary stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Calculate salaries for all staff for a month
// @route   POST /api/salaries/calculate-all
// @access  Private (Admin)
const calculateAllSalaries = async (req, res) => {
    const { month } = req.body; // YYYY-MM

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const year = parseInt(month.split('-')[0]);
        const monthIndex = parseInt(month.split('-')[1]) - 1;
        
        const startDate = new Date(Date.UTC(year, monthIndex, 1));
        const endDate = new Date(Date.UTC(year, monthIndex + 1, 0)); // Last day of month
        const totalDaysInMonth = endDate.getDate();

        const staffs = await Staff.find({ is_active: true });
        
        let count = 0;

        for (const staff of staffs) {
            // Count present days
            const presentCount = await Attendance.countDocuments({
                staff_id: staff._id,
                attendance_date: { $gte: startDate, $lte: endDate },
                status: 'Present' // Assuming only Present counts for now
            });

            // Calculate salary: (Base Salary / Total Days) * Present Days
            // Simple calculation.
            let calculated_salary = 0;
            if (staff.salary) {
                calculated_salary = Math.round((staff.salary / totalDaysInMonth) * presentCount);
            }

            // Upsert Salary Record
            await Salary.findOneAndUpdate(
                { 
                    staff_id: staff._id, 
                    payment_month: startDate 
                },
                {
                    total_days_present: presentCount,
                    total_days_in_month: totalDaysInMonth,
                    calculated_salary: calculated_salary,
                    // Preserve paid_on and notes if they exist, or set default if new
                    // Actually $setOnInsert is good for defaults, but here we want to UPDATE calculation even if exists,
                    // unless it's already paid? Usually if paid, we shouldn't overwrite?
                    // For now, let's overwrite calculation, but keep paid status.
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            count++;
        }

        res.json({ message: 'Salaries calculated', count });

    } catch (error) {
        logger.error('Error calculating salaries:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a salary record (Process Payment)
// @route   PUT /api/salaries/:id
// @access  Private (Admin)
const updateSalary = async (req, res) => {
    try {
        const { calculated_salary, paid_on, notes } = req.body;
        
        const salary = await Salary.findById(req.params.id);

        if (salary) {
            salary.calculated_salary = calculated_salary || salary.calculated_salary;
            salary.paid_on = paid_on || salary.paid_on;
            salary.notes = notes || salary.notes;

            const updatedSalary = await salary.save();
            res.json(updatedSalary);
        } else {
            res.status(404).json({ message: 'Salary record not found' });
        }
    } catch (error) {
        logger.error('Error updating salary:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a salary record
// @route   DELETE /api/salaries/:id
// @access  Private (Admin)
const deleteSalary = async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id);
        if (salary) {
            await salary.deleteOne();
            res.json({ message: 'Salary record removed' });
        } else {
            res.status(404).json({ message: 'Salary record not found' });
        }
    } catch (error) {
        logger.error('Error deleting salary:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all salary details for the logged-in staff
// @route   GET /api/salaries/mine
// @access  Private (Staff)
const getMySalaries = async (req, res) => {
    try {
        const salaries = await Salary.find({ staff_id: req.session.user.linkedId || req.session.user.id }); // Support linkedId
        res.json(salaries);
    } catch (error) {
        logger.error('Error fetching staff salaries:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a single salary record
// @route   POST /api/salaries
// @access  Private (Admin)
const createSalary = async (req, res) => {
    try {
        const { staff_id, payment_month, calculated_salary, paid_on, notes } = req.body;
        
        const salary = new Salary({
            staff_id,
            payment_month,
            calculated_salary,
            paid_on,
            notes,
            // We might want to calculate total_days_present/in_month here too if not provided
            total_days_in_month: req.body.total_days_in_month || 0,
            total_days_present: req.body.total_days_present || 0
        });

        const createdSalary = await salary.save();
        res.status(201).json(createdSalary);
    } catch (error) {
        logger.error('Error creating salary:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get attendance for a specific staff member and month
// @route   GET /api/salaries/attendance/:staffId/:month
// @access  Private (Admin)
const getStaffAttendanceByMonth = async (req, res) => {
    try {
        const { staffId, month } = req.params;
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

        const attendance = await Attendance.find({
            staff_id: staffId,
            attendance_date: { $gte: startDate, $lt: endDate }
        });

        res.json(attendance);
    } catch (error) {
        logger.error('Error fetching staff attendance:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Save bulk attendance for multiple staff
// @route   POST /api/salaries/bulk-attendance
// @access  Private (Admin)
const saveBulkAttendance = async (req, res) => {
    try {
        const { attendance_date, records } = req.body;

        if (!attendance_date || !records || !Array.isArray(records)) {
            return res.status(400).json({ message: 'Invalid data provided' });
        }

        const date = new Date(attendance_date);
        date.setHours(0, 0, 0, 0);

        for (const record of records) {
            await Attendance.findOneAndUpdate(
                {
                    staff_id: record.staff_id,
                    attendance_date: date
                },
                {
                    status: record.status
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        res.json({ message: 'Attendance saved successfully' });
    } catch (error) {
        logger.error('Error saving bulk attendance:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMySalaries,
    getSalaries,
    getSalaryStats,
    calculateAllSalaries,
    updateSalary,
    deleteSalary,
    createSalary,
    getStaffAttendanceByMonth,
    saveBulkAttendance
};
