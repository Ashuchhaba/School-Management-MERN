const User = require('../models/userModel');
const logger = require('../config/logger');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      req.session.user = {
        id: user._id,
        username: user.username,
        role: user.role,
      };
      logger.info(`User ${username} logged in successfully.`);
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
      });
    } else {
      logger.warn(`Failed login attempt for username: ${username}`);
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    logger.error(`Error during login for username: ${username}`, error);
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
