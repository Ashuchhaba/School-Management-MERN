const express = require('express');
const router = express.Router();
const Salary = require('../models/salaryModel');
const Staff = require('../models/staffModel');
const Attendance = require('../models/attendanceModel'); // Assuming you have this model
const mongoose = require('mongoose');
const Activity = require('../models/activityModel');

// @route   GET api/salaries
// @desc    Get all salaries with filtering
router.get('/', async (req, res) => {
  try {
    const { month, search } = req.query;
    let query = {};

    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);
      query.payment_month = { $gte: startDate, $lte: endDate };
    }

    let staffIds = [];
    if (search) {
      const staff = await Staff.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { employee_id: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      staffIds = staff.map(s => s._id);
      query.staff_id = { $in: staffIds };
    }
    
    const salaries = await Salary.find(query)
      .populate('staff_id', 'name designation salary')
      .sort({ paid_on: -1, payment_month: -1 });
      
    res.json(salaries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/salaries/stats
// @desc    Get payment statistics for a given month
router.get('/stats', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ message: 'Month is required' });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

    const totalStaff = await Staff.countDocuments({ is_active: true });

    const salariesInMonth = await Salary.find({
      payment_month: { $gte: startDate, $lte: endDate }
    });

    const total_salary_due = salariesInMonth.reduce((acc, cur) => acc + cur.calculated_salary, 0);
    const total_paid = salariesInMonth.filter(s => s.paid_on).reduce((acc, cur) => acc + cur.calculated_salary, 0);
    const staff_paid = new Set(salariesInMonth.filter(s => s.paid_on && s.staff_id).map(s => s.staff_id.toString())).size;

    // Simplified attendance calculation
    const attendanceRecords = await Attendance.find({
        attendance_date: { $gte: startDate, $lte: endDate },
        status: 'Present'
    });
    const totalAttendancePossible = totalStaff * new Date(endDate).getDate(); // Simplified
    const avg_attendance_percentage = totalAttendancePossible > 0 ? ((attendanceRecords.length / totalAttendancePossible) * 100).toFixed(1) : 0;


    res.json({
      total_salary_due,
      total_paid,
      staff_paid,
      total_staff: totalStaff,
      avg_attendance_percentage
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server Error: ${err.message}`);
  }
});

// @route   POST api/salaries/calculate-all
// @desc    Calculate salaries for all staff for a given month
router.post('/calculate-all', async (req, res) => {
    const { month } = req.body;
    if (!month) {
        return res.status(400).json({ message: 'Month is required.' });
    }

    try {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        const total_days_in_month = endDate.getDate();

        const staffList = await Staff.find({ is_active: true });

        let count = 0;
        for (const staff of staffList) {
            const attendance = await Attendance.countDocuments({
                staff_id: staff._id,
                status: 'Present',
                attendance_date: { $gte: startDate, $lte: endDate }
            });

            const calculated_salary = (staff.salary / total_days_in_month) * attendance;

            await Salary.findOneAndUpdate(
                { staff_id: staff._id, payment_month: startDate },
                {
                    total_days_in_month,
                    total_days_present: attendance,
                    calculated_salary: calculated_salary.toFixed(2),
                    $setOnInsert: { staff_id: staff._id, payment_month: startDate }
                },
                { upsert: true, new: true }
            );
            count++;
        }

        res.json({ success: true, message: 'Salaries calculated.', count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: Could not calculate salaries.');
    }
});

// @route   POST api/salaries/bulk-attendance
// @desc    Add new attendance records in bulk
router.post('/bulk-attendance', async (req, res) => {
    const { attendance_date, records } = req.body;
    if (!attendance_date || !records) {
        return res.status(400).json({ message: 'Date and records are required.' });
    }

    try {
        const operations = records.map(record => ({
            updateOne: {
                filter: { staff_id: record.staff_id, attendance_date },
                update: { $set: { status: record.status } },
                upsert: true
            }
        }));

        if (operations.length === 0) {
            return res.status(400).json({ message: 'No attendance records to save.' });
        }

        await Attendance.bulkWrite(operations);

        res.status(201).json({ success: true, message: 'Attendance recorded successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: Could not save attendance.');
    }
});


// @route   POST api/salaries
// @desc    Add a new salary (used by the simple, original page)
router.post('/', async (req, res) => {
  const {
    staff_id,
    payment_month,
    total_days_present,
    total_days_in_month,
    calculated_salary,
    paid_on,
    notes,
  } = req.body;

  try {
    const newSalary = new Salary({
      staff_id,
      payment_month,
      total_days_present,
      total_days_in_month,
      calculated_salary,
      paid_on,
      notes,
    });

    const salary = await newSalary.save();
    const populatedSalary = await salary.populate('staff_id', 'name designation salary');
    res.json(populatedSalary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT api/salaries/:id
// @desc    Update a salary payment
router.put('/:id', async (req, res) => {
  const {
    calculated_salary,
    paid_on,
    notes,
  } = req.body;

  try {
    let salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ msg: 'Salary not found' });

    salary.calculated_salary = calculated_salary ?? salary.calculated_salary;
    salary.paid_on = paid_on ?? salary.paid_on;
    salary.notes = notes ?? salary.notes;

    await salary.save();

    if (paid_on) {
      const staff = await Staff.findById(salary.staff_id);
      const activity = new Activity({
        title: 'Staff salary processed',
        description: `${staff.name} - ₹${salary.calculated_salary}`,
        category: 'staff',
      });
      await activity.save();
    }

    const populatedSalary = await salary.populate('staff_id', 'name designation salary');
    res.json(populatedSalary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/salaries/:id
// @desc    Delete a salary
router.delete('/:id', async (req, res) => {
  try {
    let salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ msg: 'Salary not found' });

    await Salary.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Salary removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
