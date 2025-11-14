const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  payment_month: {
    type: Date,
    required: true,
  },
  total_days_present: {
    type: Number,
    default: 0,
  },
  total_days_in_month: {
    type: Number,
    default: 0,
  },
  calculated_salary: {
    type: Number,
    required: true,
  },
  paid_on: {
    type: Date,
  },
  notes: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

salarySchema.index({ staff_id: 1, payment_month: 1 }, { unique: true });

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;