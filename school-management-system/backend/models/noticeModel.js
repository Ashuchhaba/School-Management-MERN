const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  posted_by: {
    type: String, // Name of the admin or user who posted it
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  target_audience: {
    type: String,
    enum: ['all', 'staff', 'student'],
    default: 'all',
  },
  type: {
    type: String,
    enum: ['notice', 'news'],
    default: 'notice',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
