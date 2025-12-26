const dotenv = require('dotenv');
// Load env vars
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { createDefaultAdmin } = require('./controllers/authController');
const { setNoCache } = require('./middleware/cacheControlMiddleware');
const { protect } = require('./middleware/authMiddleware');


// Connect to database
connectDB().then(() => {
  createDefaultAdmin();
});

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a secret key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', protect, setNoCache, require('./routes/studentRoutes'));
app.use('/api/staff', protect, setNoCache, require('./routes/staffRoutes'));
app.use('/api/fees', protect, setNoCache, require('./routes/feeRoutes'));
app.use('/api/salaries', protect, setNoCache, require('./routes/salaryRoutes'));
app.use('/api/activities', protect, setNoCache, require('./routes/activityRoutes'));
app.use('/api/admissions', protect, setNoCache, require('./routes/admissionRoutes'));
app.use('/api/dashboard', protect, setNoCache, require('./routes/dashboardRoutes'));
app.use('/api/reports', protect, setNoCache, require('./routes/reportRoutes'));
app.use('/api/attendance', protect, setNoCache, require('./routes/attendanceRoutes'));
app.use('/api/homework', protect, setNoCache, require('./routes/homeworkRoutes'));
app.use('/api/exams', protect, setNoCache, require('./routes/examRoutes'));
app.use('/api/leave', protect, setNoCache, require('./routes/leaveRoutes'));


app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});