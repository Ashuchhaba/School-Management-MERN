const express = require('express');
const router = express.Router();
const Fee = require('../models/feeModel');
const FeeStructure = require('../models/feeStructureModel');
const Activity = require('../models/activityModel');
const Student = require('../models/studentModel');

// @route   GET api/fees
// @desc    Get all fees
router.get('/', async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate('student_id', 'name class')
      .populate('fee_structure_id');
    res.json(fees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/fees/total
// @desc    Get total fees paid
router.get('/total', async (req, res) => {
  try {
    const total = await Fee.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$paid_amount' },
        },
      },
    ]);

    res.json(total[0] ? total[0].total : 0);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/fees
// @desc    Add or update a fee payment
router.post('/', async (req, res) => {
  const {
    student_id,
    fee_structure_id,
    payment_date,
    paid_amount,
    notes,
  } = req.body;

  // Basic validation for required fields
  if (!student_id) {
    return res.status(400).json({ msg: 'Student ID is required' });
  }
  if (!fee_structure_id) {
    return res.status(400).json({ msg: 'Fee Structure ID is required' });
  }
  if (!payment_date) {
    return res.status(400).json({ msg: 'Payment Date is required' });
  }
  if (!paid_amount) {
    return res.status(400).json({ msg: 'Paid Amount is required' });
  }

  try {
    const new_paid_amount = parseFloat(paid_amount);
    if (isNaN(new_paid_amount) || new_paid_amount <= 0) {
      return res.status(400).json({ msg: 'Invalid paid amount' });
    }

    // 1. Get the total amount from the fee structure
    const feeStructure = await FeeStructure.findById(fee_structure_id);
    if (!feeStructure) {
      return res.status(404).json({ msg: 'Fee structure not found' });
    }
    const total_amount = feeStructure.total_amount;

    // 2. Find if a fee record already exists
    let fee = await Fee.findOne({ student_id, fee_structure_id });

    if (fee) {
      // --- UPDATE EXISTING RECORD ---
      fee.paid_amount += new_paid_amount;
      fee.due_amount = total_amount - fee.paid_amount;
      fee.payment_date = payment_date;
      
      // Update status
      if (fee.paid_amount >= total_amount) {
        fee.status = 'Paid';
        fee.due_amount = 0; // Ensure due amount is not negative
      } else {
        fee.status = 'Partially Paid';
      }

      // Append notes if needed, or just update
      fee.notes = notes; 
      
      // Increment installment number - simple increment logic
      if (fee.installment_number < fee.total_installments) {
        fee.installment_number += 1;
      }

    } else {
      // --- CREATE NEW RECORD ---
      const due_amount = total_amount - new_paid_amount;
      let status = 'Partially Paid';
      if (due_amount <= 0) {
        status = 'Paid';
      }

      fee = new Fee({
        student_id,
        fee_structure_id,
        payment_date,
        paid_amount: new_paid_amount,
        due_amount: due_amount > 0 ? due_amount : 0,
        installment_number: 1, // First payment
        total_installments: feeStructure.installment_count,
        status,
        notes,
      });
    }

    const savedFee = await fee.save();

    // 3. Log this action
    const studentInfo = await Student.findById(student_id);
    const activity = new Activity({
      title: 'Fee payment received',
      description: `${studentInfo.name} - ₹${new_paid_amount}`,
      category: 'fee',
    });
    await activity.save();

    res.json(savedFee);
  } catch (err) {
    console.error(err.message);
    // Provide more specific error feedback for validation issues
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/fees/:id
// @desc    Update a fee
router.put('/:id', async (req, res) => {
  const {
    student_id,
    fee_structure_id,
    payment_date,
    paid_amount,
    due_amount,
    installment_number,
    total_installments,
    status,
    notes,
  } = req.body;

  const feeFields = {
    student_id,
    fee_structure_id,
    payment_date,
    paid_amount,
    due_amount,
    installment_number,
    total_installments,
    status,
    notes,
  };

  try {
    let fee = await Fee.findById(req.params.id);

    if (!fee) return res.status(404).json({ msg: 'Fee not found' });

    fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { $set: feeFields },
      { new: true }
    );

    res.json(fee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/fees/:id
// @desc    Delete a fee
router.delete('/:id', async (req, res) => {
  try {
    let fee = await Fee.findById(req.params.id);

    if (!fee) return res.status(404).json({ msg: 'Fee not found' });

    await Fee.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Fee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fee Structure Routes

// @route   GET api/fees/structure
// @desc    Get all fee structures
router.get('/structure', async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find();
    res.json(feeStructures);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/fees/structure
// @desc    Add a new fee structure
router.post('/structure', async (req, res) => {
  const {
    class: feeClass,
    term,
    total_amount,
    installment_count,
    description,
  } = req.body;

  try {
    const newFeeStructure = new FeeStructure({
      class: feeClass,
      term,
      total_amount,
      installment_count,
      description,
    });

    const feeStructure = await newFeeStructure.save();
    res.json(feeStructure);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/fees/structure/:id
// @desc    Update a fee structure
router.put('/structure/:id', async (req, res) => {
  const {
    class: feeClass,
    term,
    total_amount,
    installment_count,
    description,
  } = req.body;

  const feeStructureFields = {
    class: feeClass,
    term,
    total_amount,
    installment_count,
    description,
  };

  try {
    let feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure)
      return res.status(404).json({ msg: 'Fee structure not found' });

    feeStructure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      { $set: feeStructureFields },
      { new: true }
    );

    res.json(feeStructure);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/fees/structure/:id
// @desc    Delete a fee structure
router.delete('/structure/:id', async (req, res) => {
  try {
    let feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure)
      return res.status(404).json({ msg: 'Fee structure not found' });

    await FeeStructure.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Fee structure removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;