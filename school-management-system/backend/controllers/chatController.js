const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Staff = require('../models/staffModel');
const Student = require('../models/studentModel');
const logger = require('../config/logger');

// @desc    Get or Create a chat between two users
// @route   POST /api/chat/get-or-create
const getOrCreateChat = async (req, res) => {
  const { userId } = req.body; // The other user's ID (User collection ID)
  const myId = req.session.user.id;
  const myRole = req.session.user.role;

  try {
    // Security Check: Students can only chat with Staff
    if (myRole === 'student') {
        const otherUser = await User.findById(userId);
        if (otherUser && otherUser.role !== 'staff') {
            return res.status(403).json({ message: 'Students can only chat with staff members.' });
        }
    }

    let chat = await Chat.findOne({
      participants: { $all: [myId, userId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [myId, userId]
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    logger.error('Error in getOrCreateChat:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all chats for the logged-in user
const getMyChats = async (req, res) => {
  const myId = req.session.user.id;

  try {
    const chats = await Chat.find({ participants: myId })
      .populate('participants', 'role username email referenceId')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    // Manually attach names and unread counts
    const populatedChats = await Promise.all(chats.map(async (chat) => {
        const plainChat = chat.toObject();
        
        // Count unread messages where receiver is me
        const unreadCount = await Message.countDocuments({
            chatId: chat._id,
            receiverId: myId,
            isRead: false
        });

        const participantsWithNames = await Promise.all(plainChat.participants.map(async (p) => {
            if (p.role === 'staff') {
                const profile = await Staff.findById(p.referenceId).select('name');
                return { ...p, name: profile?.name || p.username };
            } else if (p.role === 'student') {
                const profile = await Student.findById(p.referenceId).select('name');
                return { ...p, name: profile?.name || p.username };
            }
            return { ...p, name: 'Admin' };
        }));
        
        return { ...plainChat, participants: participantsWithNames, unreadCount };
    }));

    res.status(200).json(populatedChats);
  } catch (error) {
    logger.error('Error in getMyChats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get messages for a specific chat
// @route   GET /api/chat/messages/:chatId
const getChatMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    logger.error('Error in getChatMessages:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get list of staff for students to chat with
// @route   GET /api/chat/staff-list
const getStaffListForChat = async (req, res) => {
  try {
    // Find all users with role 'staff'
    const staffUsers = await User.find({ role: 'staff' }).select('-password');
    
    // We want to attach designation and subject from Staff collection
    const staffProfiles = await Staff.find({});
    
    const combinedList = staffUsers.map(user => {
        const profile = staffProfiles.find(p => p._id.toString() === user.referenceId?.toString());
        return {
            _id: user._id,
            name: user.name || profile?.name,
            role: user.role,
            designation: profile?.designation,
            subjects: profile?.subjects_taught,
            referenceId: user.referenceId
        };
    });

    res.status(200).json(combinedList);
  } catch (error) {
    logger.error('Error in getStaffListForChat:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get list of students for staff to chat with
// @route   GET /api/chat/student-list
const getStudentListForChat = async (req, res) => {
  try {
    // Find all users with role 'student'
    const studentUsers = await User.find({ role: 'student' }).select('-password');
    
    // We want to attach class and roll number from Student collection
    const studentProfiles = await Student.find({});
    
    const combinedList = studentUsers.map(user => {
        const profile = studentProfiles.find(p => p._id.toString() === user.referenceId?.toString());
        return {
            _id: user._id,
            name: profile?.name || user.username,
            role: user.role,
            class: profile?.class,
            roll_no: profile?.roll_no,
            referenceId: user.referenceId
        };
    });

    res.status(200).json(combinedList);
  } catch (error) {
    logger.error('Error in getStudentListForChat:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark all messages in a chat as read
// @route   PUT /api/chat/read/:chatId
const markMessagesAsRead = async (req, res) => {
  const myId = req.session.user.id;
  const { chatId } = req.params;

  try {
    await Message.updateMany(
      { chatId, receiverId: myId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    logger.error('Error in markMessagesAsRead:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Edit a message
// @route   PUT /api/chat/message/:messageId
const editMessage = async (req, res) => {
  const { text } = req.body;
  const myId = req.session.user.id;

  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    // Security: Only sender can edit
    if (message.senderId.toString() !== myId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to edit this message' });
    }

    message.text = text;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    logger.error('Error in editMessage:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/chat/message/:messageId
const deleteMessage = async (req, res) => {
  const myId = req.session.user.id;

  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    // Security: Only sender can delete
    if (message.senderId.toString() !== myId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this message' });
    }

    await message.deleteOne();
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    logger.error('Error in deleteMessage:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getOrCreateChat,
  getMyChats,
  getChatMessages,
  getStaffListForChat,
  getStudentListForChat,
  markMessagesAsRead,
  editMessage,
  deleteMessage
};
