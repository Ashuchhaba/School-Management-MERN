const mongoose = require('mongoose');

const StudentAttendanceSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
  marked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
}, {
  timestamps: true,
});

StudentAttendanceSchema.index({ student_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StudentAttendance', StudentAttendanceSchema);
