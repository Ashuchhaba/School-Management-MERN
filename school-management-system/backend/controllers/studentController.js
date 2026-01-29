const Student = require('../models/studentModel');
const User = require('../models/userModel');
const Admissions = require('../models/admissionsModel');
const Activity = require('../models/activityModel');
const StudentAttendance = require('../models/studentAttendanceModel');
const Fee = require('../models/feeModel');
const FeeStructure = require('../models/feeStructureModel');
const crypto = require('crypto');

// @desc    Get dashboard stats for logged-in student
// @route   GET /api/students/dashboard-stats
// @access  Private (Student)
const getStudentDashboardStats = async (req, res) => {
    try {
        const studentId = req.session.user.linkedId;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Attendance Calculation
        const totalAttendanceDays = await StudentAttendance.countDocuments({ student_id: studentId });
        const presentDays = await StudentAttendance.countDocuments({ student_id: studentId, status: 'Present' });
        const attendancePercentage = totalAttendanceDays > 0 ? ((presentDays / totalAttendanceDays) * 100).toFixed(1) : 0;

        // Fees Calculation
        // 1. Get total expected fees from Fee Structure for student's class
        const feeStructures = await FeeStructure.find({ class: student.class });
        const totalExpectedFee = feeStructures.reduce((acc, fs) => acc + (fs.total_amount || 0), 0);

        // 2. Get total paid fees
        const fees = await Fee.find({ student_id: studentId });
        const totalPaidFee = fees.reduce((acc, fee) => acc + (fee.paid_amount || 0), 0);

        // 3. Calculate Due
        const feeDue = Math.max(0, totalExpectedFee - totalPaidFee);

        res.json({
            class: student.class,
            section: student.section,
            attendancePercentage,
            feeDue,
            nextExam: 'Coming Soon', // Placeholder
            studentName: student.name
        });

    } catch (error) {
        console.error('Error fetching student dashboard stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all students, optionally filtered by class
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
  try {
    const { class: className } = req.query;
    let query = {};
    if (className) {
      query.class = className;
    }

    const students = await Student.find(query).lean();
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
    const { gr_no, email } = req.body;

    // Check if user already exists (by gr_no or email if provided)
    const existingUserQuery = [{ username: gr_no }];
    if (email) existingUserQuery.push({ email: email });
    
    const userExists = await User.findOne({ $or: existingUserQuery });
    
    if (userExists) {
        return res.status(400).json({ message: 'User account with this Admission No or Email already exists.' });
    }

    const student = new Student({
      ...req.body,
    });
    const createdStudent = await student.save();

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 characters

    // Create User account
    const user = new User({
        username: gr_no, // Use Admission Number as username
        email: email || undefined, // Email is optional
        password: tempPassword,
        role: 'student',
        referenceId: createdStudent._id,
        isFirstLogin: true,
        status: createdStudent.is_active
    });

    await user.save();

    res.status(201).json({
        student: createdStudent,
        tempPassword: tempPassword
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
        res.status(400).json({ message: 'Duplicate Admission No or other unique field.' });
    } else {
        res.status(500).json({ message: 'Server Error' });
    }
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

      // Sync status with User account if changed
      if (req.body.is_active !== undefined) {
           await User.updateOne(
              { referenceId: student._id },
              { status: req.body.is_active }
           );
      }

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
      // Delete associated user
      await User.deleteOne({ referenceId: student._id });
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

// @desc    Reset student password (Admin only)
// @route   PUT /api/students/:id/reset-password
// @access  Private (Admin)
const resetStudentPassword = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // 1. Try to find user by linked Reference ID
        let user = await User.findOne({ referenceId: studentId });
        
        // Generate new random password
        const newPassword = crypto.randomBytes(4).toString('hex'); // 8 characters

        if (!user) {
            // 2. If not found by link, try to find by Username (gr_no)
            user = await User.findOne({ username: student.gr_no });

            if (user) {
                // Found a user with this gr_no but not linked. Re-link it.
                user.referenceId = student._id;
                user.role = 'student'; 
            } else {
                // 3. No user found. Check for conflicts before creating.
                // We already checked username above. Check email if exists.
                if (student.email) {
                    const emailTaken = await User.findOne({ email: student.email });
                    if (emailTaken) {
                         return res.status(400).json({ message: `The email ${student.email} is already associated with another user account.` });
                    }
                }

                // Create User account
                user = new User({
                    username: student.gr_no,
                    email: student.email || undefined,
                    password: newPassword,
                    role: 'student',
                    referenceId: student._id,
                    isFirstLogin: true,
                    status: student.is_active
                });
            }
        }
        
        // Update existing (or found) user password
        user.password = newPassword; 
        user.isFirstLogin = true; 
        await user.save();

        res.json({ 
            message: 'Password reset successfully', 
            newPassword: newPassword 
        });

    } catch (error) {
        console.error('Error resetting student password:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Change student password
// @route   PUT /api/students/change-password
// @access  Private (Student)
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.session.user.id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            user.isFirstLogin = false;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).send('Invalid current password');
        }
    } catch (error) {
        console.error(`Error changing password for user ID: ${req.session.user.id}`, error);
        res.status(500).send('Server error');
    }
};

// @desc    Get logged-in student profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.session.user.linkedId);
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { 
    getStudents, 
    getStudentById, 
    createStudent, 
    updateStudent, 
    deleteStudent, 
    getStudentCountByClass, 
    approveAdmission, 
    resetStudentPassword,
    getStudentDashboardStats,
    changePassword,
    getStudentProfile
};