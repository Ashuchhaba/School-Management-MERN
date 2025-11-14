const express = require('express');
const router = express.Router();
const Activity = require('../models/activityModel');

// @route   GET api/activities
// @desc    Get recent activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(4);
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
