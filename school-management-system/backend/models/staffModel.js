const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
  },
  date_of_join: {
    type: Date,
    default: Date.now,
  },
  mobile_no: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  class_teacher_of: {
    type: String,
  },
  subjects_taught: {
    type: String,
  },
  assigned_classes: {
    type: [String],
    default: [],
  },
  salary: {
    type: Number,
    default: 0.0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;