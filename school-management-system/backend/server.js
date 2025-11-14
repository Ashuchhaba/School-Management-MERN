const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/salaries', require('./routes/salaryRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});