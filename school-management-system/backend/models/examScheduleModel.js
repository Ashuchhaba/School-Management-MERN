const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  exam_type: {
    type: String,
    required: true, // e.g., 'Mid-term', 'Final'
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  start_time: {
    type: String,
    required: true, // e.g., '10:00 AM'
  },
  end_time: {
    type: String,
    required: true, // e.g., '01:00 PM'
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);

module.exports = ExamSchedule;
