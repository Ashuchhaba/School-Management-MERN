const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  gr_no: {
    type: String,
    required: true,
    unique: true,
  },
  udise_no: {
    type: String,
    required: true,
    unique: true,
  },
  pan_no: {
    type: String,
    unique: true,
  },
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
  religion: {
    type: String,
  },
  caste: {
    type: String,
  },
  date_of_join: {
    type: Date,
    default: Date.now,
  },
  class: {
    type: String,
    required: true,
  },
  roll_no: {
    type: String,
    required: true,
  },
  father_name: {
    type: String,
    required: true,
  },
  mother_name: {
    type: String,
    required: true,
  },
  mobile_no1: {
    type: String,
    required: true,
  },
  mobile_no2: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  admission_date: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

studentSchema.index({ class: 1, roll_no: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;