const User = require('../models/userModel');
const Staff = require('../models/staffModel');
const logger = require('../config/logger');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { identifier, password, role } = req.body;

  try {
    let user;
    if (role === 'Admin') {
      user = await User.findOne({ username: identifier });
    } else if (role === 'Staff') {
      user = await Staff.findOne({
        $or: [{ email: identifier }, { mobile_no: identifier }],
      });
    } else if (role === 'Student') {
      // Logic for student login can be added here
      logger.warn(`Login attempt for unimplemented role: Student`);
      return res.status(400).send('Student login is not yet implemented.');
    } else {
      logger.warn(`Invalid role specified: ${role}`);
      return res.status(400).send('Invalid role specified.');
    }

    if (user && (await user.matchPassword(password))) {
      req.session.user = {
        id: user._id,
        name: user.name || user.username,
        role: role.toLowerCase(),
      };
      logger.info(`User ${user.name || user.username} logged in successfully as ${role}.`);
      res.json({
        _id: user._id,
        name: user.name || user.username,
        role: role.toLowerCase(),
      });
    } else {
      logger.warn(`Failed login attempt for identifier: ${identifier} with role: ${role}`);
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    logger.error(`Error during login for identifier: ${identifier}`, error);
    res.status(500).send('Server error');
  }
};

// @desc    Logout user / clear session
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
  const username = req.session.user ? req.session.user.username : 'Unknown';
  req.session.destroy((err) => {
    if (err) {
      logger.error(`Error during logout for user: ${username}`, err);
      res.status(500).send('Could not log out.');
    } else {
      logger.info(`User ${username} logged out successfully.`);
      res.clearCookie('connect.sid'); // The default session cookie name
      res.status(200).send('Logged out successfully');
    }
  });
};

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).select('-password');
    res.json(user);
  } catch (error) {
    logger.error(`Error fetching user profile for user ID: ${req.session.user.id}`, error);
    res.status(500).send('Server error');
  }
};

// Create a default admin user if none exists
const createDefaultAdmin = async () => {
  try {
    const userExists = await User.findOne({ username: 'admin' });
    if (!userExists) {
      const user = new User({
        username: 'admin',
        password: 'admin123', // This will be hashed by the pre-save hook
      });
      await user.save();
      logger.info('Default admin user created.');
    }
  } catch (error) {
    logger.error('Error creating default admin user:', error);
  }
};

module.exports = {
  loginUser,
  logoutUser,
  getCurrentUser,
  createDefaultAdmin,
};
