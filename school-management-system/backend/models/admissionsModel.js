const mongoose = require('mongoose');

const AdmissionsSchema = new mongoose.Schema({
  applicant_name: {
    type: String,
    required: true,
  },
  applicant_dob: {
    type: Date,
    required: true,
  },
  applicant_gender: {
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
  contact_no1: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Contact number must be exactly 10 digits'],
  },
  contact_no2: {
    type: String,
    match: [/^\d{10}$/, 'Contact number must be exactly 10 digits'],
  },
  address: {
    type: String,
    required: true,
  },
  applying_for_class: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
  },
  notes: {
    type: String,
  },
  submission_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('admissions', AdmissionsSchema);
