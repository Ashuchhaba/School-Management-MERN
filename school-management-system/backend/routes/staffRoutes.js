const express = require('express');
const router = express.Router();
const Staff = require('../models/staffModel');
const Activity = require('../models/activityModel');

// @route   GET api/staff
// @desc    Get all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/staff/count
// @desc    Get total number of staff
router.get('/count', async (req, res) => {
  try {
    const count = await Staff.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/staff
// @desc    Add a new staff member
router.post('/', async (req, res) => {
  const {
    name,
    dob,
    gender,
    qualification,
    experience,
    date_of_join,
    mobile_no,
    email,
    address,
    designation,
    class_teacher_of,
    subjects_taught,
    salary,
  } = req.body;

  try {
    const newStaff = new Staff({
      name,
      dob,
      gender,
      qualification,
      experience,
      date_of_join,
      mobile_no,
      email,
      address,
      designation,
      class_teacher_of,
      subjects_taught,
      salary,
    });

    const staff = await newStaff.save();

    const activity = new Activity({
      title: 'New staff added',
      description: staff.name,
      category: 'staff',
    });
    await activity.save();

    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/staff/:id
// @desc    Update a staff member
router.put('/:id', async (req, res) => {
  const {
    name,
    dob,
    gender,
    qualification,
    experience,
    date_of_join,
    mobile_no,
    email,
    address,
    designation,
    class_teacher_of,
    subjects_taught,
    salary,
  } = req.body;

  const staffFields = {
    name,
    dob,
    gender,
    qualification,
    experience,
    date_of_join,
    mobile_no,
    email,
    address,
    designation,
    class_teacher_of,
    subjects_taught,
    salary,
  };

  try {
    let staff = await Staff.findById(req.params.id);

    if (!staff) return res.status(404).json({ msg: 'Staff not found' });

    staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: staffFields },
      { new: true }
    );

    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/staff/:id
// @desc    Delete a staff member
router.delete('/:id', async (req, res) => {
  try {
    let staff = await Staff.findById(req.params.id);

    if (!staff) return res.status(404).json({ msg: 'Staff not found' });

    await Staff.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Staff member removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;