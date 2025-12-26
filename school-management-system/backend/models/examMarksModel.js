const mongoose = require('mongoose');

const ExamMarksSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  exam_type: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
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

ExamMarksSchema.index({ student_id: 1, class: 1, subject: 1, exam_type: 1 }, { unique: true });

module.exports = mongoose.model('ExamMarks', ExamMarksSchema);
