const Student = require('../models/studentModel');
const Staff = require('../models/staffModel');
const Fee = require('../models/feeModel');
const Salary = require('../models/salaryModel');
const Activity = require('../models/activityModel');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ is_active: true });
    const totalStaff = await Staff.countDocuments({ is_active: true });

    // Monthly Fees
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const monthlyFees = await Fee.aggregate([
      {
        $match: {
          payment_date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$paid_amount' },
        },
      },
    ]);

    // Monthly Expenses (Salaries)
    const monthlyExpenses = await Salary.aggregate([
        {
            $match: {
                paid_on: { $gte: startOfMonth, $lt: endOfMonth },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$calculated_salary' },
            },
        },
    ]);

    res.json({
      totalStudents,
      totalStaff,
      monthlyFees: monthlyFees.length > 0 ? monthlyFees[0].total : 0,
      monthlyExpenses: monthlyExpenses.length > 0 ? monthlyExpenses[0].total : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get class-wise student distribution
// @route   GET /api/dashboard/class-distribution
// @access  Public
const getClassDistribution = async (req, res) => {
  try {
    const classDistribution = await Student.aggregate([
      { $match: { is_active: true } },
      {
        $group: {
          _id: '$class',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(classDistribution);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/recent-activities
// @access  Public
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(5);
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats,
  getClassDistribution,
  getRecentActivities,
};
