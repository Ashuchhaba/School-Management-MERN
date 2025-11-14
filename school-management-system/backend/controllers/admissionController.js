const Admissions = require('../models/admissionsModel');
const Student = require('../models/studentModel');

// @desc    Get all admissions
// @route   GET /api/admissions
// @access  Private
const getAdmissions = async (req, res) => {
  try {
    const admissions = await Admissions.find().sort({ submission_date: -1 });
    res.json(admissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get admission by ID
// @route   GET /api/admissions/:id
// @access  Private
const getAdmissionById = async (req, res) => {
  try {
    const admission = await Admissions.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ msg: 'Admission not found' });
    }
    res.json(admission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new admission
// @route   POST /api/admissions
// @access  Private
const createAdmission = async (req, res) => {
  const {
    applicant_name,
    applicant_dob,
    applicant_gender,
    father_name,
    mother_name,
    contact_no1,
    contact_no2,
    address,
    applying_for_class,
    notes,
  } = req.body;

  try {
    const newAdmission = new Admissions({
      applicant_name,
      applicant_dob,
      applicant_gender,
      father_name,
      mother_name,
      contact_no1,
      contact_no2,
      address,
      applying_for_class,
      notes,
      status: 'Pending',
      submission_date: new Date(),
    });

    const admission = await newAdmission.save();
    res.json(admission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update an admission
// @route   PUT /api/admissions/:id
// @access  Private
const updateAdmission = async (req, res) => {
  const {
    applicant_name,
    applicant_dob,
    applicant_gender,
    father_name,
    mother_name,
    contact_no1,
    contact_no2,
    address,
    applying_for_class,
    status,
    notes,
  } = req.body;

  const admissionFields = {
    applicant_name,
    applicant_dob,
    applicant_gender,
    father_name,
    mother_name,
    contact_no1,
    contact_no2,
    address,
    applying_for_class,
    status,
    notes,
  };

  try {
    let admission = await Admissions.findById(req.params.id);

    if (!admission) return res.status(404).json({ msg: 'Admission not found' });

    admission = await Admissions.findByIdAndUpdate(
      req.params.id,
      { $set: admissionFields },
      { new: true }
    );

    res.json(admission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an admission
// @route   DELETE /api/admissions/:id
// @access  Private
const deleteAdmission = async (req, res) => {
  try {
    let admission = await Admissions.findById(req.params.id);

    if (!admission) return res.status(404).json({ msg: 'Admission not found' });

    await Admissions.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Admission removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Approve an admission and create a student
// @route   POST /api/admissions/approve
// @access  Private
const approveAdmission = async (req, res) => {
  const {
    admission_id,
    gr_no,
    udise_no,
    pan_no,
    roll_no,
    date_of_join,
  } = req.body;

  try {
    const admission = await Admissions.findById(admission_id);

    if (!admission) {
      return res.status(404).json({ msg: 'Admission not found' });
    }

    const newStudent = new Student({
      name: admission.applicant_name,
      dob: admission.applicant_dob,
      gender: admission.applicant_gender,
      father_name: admission.father_name,
      mother_name: admission.mother_name,
      mobile_no1: admission.contact_no1,
      mobile_no2: admission.contact_no2,
      address: admission.address,
      class: admission.applying_for_class,
      gr_no,
      udise_no,
      pan_no,
      roll_no,
      date_of_join,
    });

    await newStudent.save();

    admission.status = 'Approved';
    await admission.save();

    res.json({ msg: 'Admission approved and student created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Reject an admission
// @route   POST /api/admissions/reject/:id
// @access  Private
const rejectAdmission = async (req, res) => {
  try {
    const admission = await Admissions.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({ msg: 'Admission not found' });
    }

    admission.status = 'Rejected';
    await admission.save();

    res.json({ msg: 'Admission rejected successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  approveAdmission,
  rejectAdmission,
};
