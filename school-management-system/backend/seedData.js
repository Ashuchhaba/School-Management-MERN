
require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');
const Student = require('./models/studentModel');
const Staff = require('./models/staffModel');
const User = require('./models/userModel');

const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Ishaan', 'Aaryan', 'Krishna', 'Atharv', 'Raunak', 'Ananya', 'Diya', 'Ishita', 'Saanvi', 'Kiara', 'Myra', 'Anika', 'Prisha', 'Aavya', 'Navya'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Reddy', 'Choudhary', 'Kumar', 'Jain', 'Mishra', 'Yadav', 'Malhotra', 'Iyer', 'Nair', 'Deshmukh', 'Kulkarni', 'Mehta', 'Bose', 'Chatterjee', 'Dubey'];

const getRandomName = () => {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
};

const getRandomGender = () => ['Male', 'Female'][Math.floor(Math.random() * 2)];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Add 10 Staff
        console.log('Adding 10 staff members...');
        for (let i = 1; i <= 10; i++) {
            const email = `staff${i + 500}@example.com`; // Changed range to avoid any overlap
            
            const existingStaff = await Staff.findOne({ email });
            if (existingStaff) {
                console.log(`Staff ${email} already exists, skipping.`);
                continue;
            }

            const name = getRandomName();
            const mobile = `9876543${(i + 500).toString().padStart(3, '0')}`;
            
            const staff = new Staff({
                name,
                dob: new Date('1980-01-01'),
                gender: getRandomGender(),
                qualification: 'B.Ed, M.A.',
                experience: `${Math.floor(Math.random() * 10) + 1} years`,
                mobile_no: mobile,
                email,
                address: 'Near Main Road, City',
                designation: 'Teacher',
                salary: 25000 + (i * 1000)
            });
            await staff.save();

            const tempPassword = crypto.randomBytes(4).toString('hex');
            const user = new User({
                username: email,
                email: email,
                password: tempPassword,
                role: 'staff',
                referenceId: staff._id,
                isFirstLogin: true,
                status: true
            });
            await user.save();
        }
        console.log('Staff members added.');

        // Add 100 Students
        const classes = ['10th', '4th', '5th', '8th'];
        console.log('Adding 100 students...');
        
        let studentCount = 0;
        for (const className of classes) {
            for (let i = 1; i <= 25; i++) {
                studentCount++;
                const gr_no = `GR_SEED_${studentCount + 1000}`; // Very unique
                const udise_no = `UDISE_SEED_${studentCount + 1000}`;
                const pan_no = `PAN_SEED_${studentCount + 1000}`;
                const roll_no = (i + 100).toString(); // High roll numbers to avoid collision
                
                const existingStudent = await Student.findOne({ gr_no });
                if (existingStudent) {
                    continue;
                }

                const name = getRandomName();
                const student = new Student({
                    gr_no,
                    udise_no,
                    pan_no,
                    name,
                    dob: new Date('2010-01-01'),
                    gender: getRandomGender(),
                    class: className,
                    roll_no,
                    father_name: getRandomName(),
                    mother_name: getRandomName(),
                    mobile_no1: `9988776${(studentCount + 500).toString().padStart(3, '0')}`,
                    address: 'Student Residential Area, City'
                });
                await student.save();

                const tempPassword = crypto.randomBytes(4).toString('hex');
                const user = new User({
                    username: gr_no,
                    password: tempPassword,
                    role: 'student',
                    referenceId: student._id,
                    isFirstLogin: true,
                    status: true
                });
                await user.save();
            }
        }
        console.log('100 students added.');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    }
};

seedData();
