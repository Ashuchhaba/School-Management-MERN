const Student = require('../models/studentModel');
const Admissions = require('../models/admissionsModel');
const Activity = require('../models/activityModel');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).lean();
    const formattedStudents = students.map(student => ({
      ...student,
      rollNo: student.roll_no,
      mobile: student.mobile_no1,
      admissionDate: student.admission_date,
    }));
    res.json(formattedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (student) {
      const formattedStudent = {
        ...student,
        rollNo: student.roll_no,
        mobile: student.mobile_no1,
        admissionDate: student.admission_date,
      };
      res.json(formattedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  try {
    const student = new Student({
      ...req.body,
    });
    const createdStudent = await student.save();
    res.status(201).json(createdStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      // Update fields
      for (const key in req.body) {
        student[key] = req.body[key];
      }
      const updatedStudent = await student.save();
      const plainStudent = updatedStudent.toObject();
      const formattedStudent = {
        ...plainStudent,
        rollNo: plainStudent.roll_no,
        mobile: plainStudent.mobile_no1,
        admissionDate: plainStudent.admission_date,
      };
      res.json(formattedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      await student.deleteOne();
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get student count by class
// @route   GET /api/students/count-by-class
// @access  Public
const getStudentCountByClass = async (req, res) => {
  try {
    const studentCountByClass = await Student.aggregate([
      {
        $group: {
          _id: '$class',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(studentCountByClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve an admission and create a student
// @route   POST /api/students/approve
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

    const newActivity = new Activity({
      title: 'New student admission',
      description: `${newStudent.name} - Grade ${newStudent.class}`,
      category: 'student',
    });
    await newActivity.save();
    console.log('New student activity created:', newActivity);

    res.json({ msg: 'Admission approved and student created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent, getStudentCountByClass, approveAdmission };