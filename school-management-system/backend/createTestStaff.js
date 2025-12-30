
require('dotenv').config();
const mongoose = require('mongoose');
const Staff = require('./models/staffModel');
const User = require('./models/userModel');

const createTestStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'staff@example.com';
    const password = 'password123';

    let staff = await Staff.findOne({ email });
    if (!staff) {
      staff = new Staff({
        name: 'Test Staff',
        dob: new Date('1990-01-01'),
        gender: 'Male',
        qualification: 'M.Sc.',
        experience: '5 years',
        mobile_no: '1234567890',
        email: email,
        address: '123 Main St',
        designation: 'Teacher',
        assigned_classes: ['10', '12'],
      });
      await staff.save();
      console.log('Test staff profile created.');
    }

    let user = await User.findOne({ username: email });
    if (!user) {
        user = new User({
            username: email,
            email: email,
            password: password,
            role: 'staff',
            referenceId: staff._id,
            isFirstLogin: true,
            status: true
        });
        await user.save();
        console.log('Test staff login user created.');
    } else {
        user.referenceId = staff._id;
        user.role = 'staff';
        await user.save();
        console.log('Test staff login user updated.');
    }
    
    console.log(`\nTest Credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error('Error creating or updating test staff user:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
};

createTestStaff();
