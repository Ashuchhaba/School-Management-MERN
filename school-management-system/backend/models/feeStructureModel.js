const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    enum: ['Full', 'Term 1', 'Term 2', 'Term 3'],
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  installment_count: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
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

feeStructureSchema.index({ class: 1, term: 1 }, { unique: true });

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

module.exports = FeeStructure;