const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['student', 'fee', 'staff'],
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'deleted'],
  },
  data: {
    type: Object,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
