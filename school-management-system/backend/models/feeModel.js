const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  fee_structure_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeStructure',
  },
  payment_date: {
    type: Date,
    required: true,
  },
  paid_amount: {
    type: Number,
    required: true,
  },
  due_amount: {
    type: Number,
    required: true,
  },
  installment_number: {
    type: Number,
  },
  total_installments: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Paid', 'Partially Paid', 'Due'],
    default: 'Due',
  },
  notes: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;