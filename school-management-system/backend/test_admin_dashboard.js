const axios = require('axios');

const testAdminDashboard = async () => {
    try {
        console.log('Logging in as Admin...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            identifier: 'admin',
            password: 'admin123',
            role: 'Admin'
        });
        const cookie = loginRes.headers['set-cookie'];

        console.log('Fetching Admin Dashboard Stats...');
        const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
            headers: { Cookie: cookie },
            withCredentials: true
        });

        console.log('Response:', res.data);

        console.log('Fetching All Students...');
        const resStudents = await axios.get('http://localhost:5000/api/students', {
            headers: { Cookie: cookie },
            withCredentials: true
        });
        console.log(`Fetched ${resStudents.data.length} students.`);

        console.log('Fetching All Staff...');
        const resStaff = await axios.get('http://localhost:5000/api/staff', {
            headers: { Cookie: cookie },
            withCredentials: true
        });
        console.log(`Fetched ${resStaff.data.length} staff.`);

    } catch (error) {
        console.error('Test Failed:', error);
        if (error.response) console.error('Response:', error.response.data);
    }
};

testAdminDashboard();
