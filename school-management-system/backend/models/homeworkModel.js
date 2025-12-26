const mongoose = require('mongoose');

const HomeworkSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  fileUrl: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Homework', HomeworkSchema);
