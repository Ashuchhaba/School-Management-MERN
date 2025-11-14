const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  attendance_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],
    required: true,
  },

}, {
  timestamps: true,
});

// Add a unique compound index to prevent duplicate entries for the same staff on the same day
AttendanceSchema.index({ staff_id: 1, attendance_date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
