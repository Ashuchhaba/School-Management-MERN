
require('dotenv').config();
const mongoose = require('mongoose');
const Staff = require('./models/staffModel');

const createTestStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    let staff = await Staff.findOne({ email: 'staff@example.com' });
    if (!staff) {
      staff = new Staff({
        name: 'Test Staff',
        dob: new Date('1990-01-01'),
        gender: 'Male',
        qualification: 'M.Sc.',
        experience: '5 years',
        mobile_no: '1234567890',
        email: 'staff@example.com',
        password: 'password123',
        address: '123 Main St',
        designation: 'Teacher',
        assigned_classes: ['10', '12'],
      });
      await staff.save();
      console.log('Test staff user created.');
    } else {
      staff.assigned_classes = ['10', '12'];
      await staff.save();
      console.log('Test staff user updated with assigned classes.');
    }
  } catch (error) {
    console.error('Error creating or updating test staff user:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
};

createTestStaff();
