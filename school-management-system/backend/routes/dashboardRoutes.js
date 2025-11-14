const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getClassDistribution,
  getRecentActivities,
} = require('../controllers/dashboardController');

// @route   GET api/dashboard/stats
router.get('/stats', getDashboardStats);

// @route   GET api/dashboard/class-distribution
router.get('/class-distribution', getClassDistribution);

// @route   GET api/dashboard/recent-activities
router.get('/recent-activities', getRecentActivities);

module.exports = router;
