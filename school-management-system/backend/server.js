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
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

const Message = require('./models/messageModel');
const Chat = require('./models/chatModel');

app.set('trust proxy', 1); // Trust first proxy

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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-site cookies
    },
  })
);

// Define Routes
const { getPublicStats } = require('./controllers/dashboardController');
const { getPublicNews } = require('./controllers/noticeController');
const publicRouter = express.Router();
publicRouter.get('/stats', getPublicStats);
publicRouter.get('/news', getPublicNews);
app.use('/api/public', publicRouter);

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
app.use('/api/notices', protect, setNoCache, require('./routes/noticeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Socket.io Logic
const userSockets = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId); // Join a room named after the user ID
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('sendMessage', async (data) => {
    const { chatId, senderId, receiverId, text } = data;
    console.log(`Socket: Sending message from ${senderId} to ${receiverId} in chat ${chatId}`);
    try {
      const newMessage = new Message({
        chatId,
        senderId,
        receiverId,
        text
      });
      const savedMessage = await newMessage.save();

      // Update Chat lastMessage
      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: savedMessage._id,
        updatedAt: Date.now()
      });

      // Emit to both sender and receiver
      io.to(senderId).to(receiverId).emit('receiveMessage', savedMessage);
      
      // Also emit a notification to the receiver room
      io.to(receiverId).emit('notification', {
          type: 'new_message',
          chatId,
          senderId,
          text: text.substring(0, 50)
      });

    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('typing', (data) => {
    const { receiverId, senderId, isTyping } = data;
    io.to(receiverId).emit('displayTyping', { senderId, isTyping });
  });

  socket.on('editMessage', (data) => {
    const { chatId, messageId, senderId, receiverId, newText } = data;
    // Emit to both to update UI instantly
    io.to(senderId).to(receiverId).emit('messageEdited', { chatId, messageId, newText });
  });

  socket.on('deleteMessage', (data) => {
    const { chatId, messageId, senderId, receiverId } = data;
    // Emit to both
    io.to(senderId).to(receiverId).emit('messageDeleted', { chatId, messageId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Remove from map if needed
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});