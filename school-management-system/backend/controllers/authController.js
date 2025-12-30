const User = require('../models/userModel');
const Staff = require('../models/staffModel');
const logger = require('../config/logger');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { identifier, password, role } = req.body;

  try {
    // Check User collection for both Admin and Staff
    // For Staff, identifier is email which is stored as username in User model
    const user = await User.findOne({ username: identifier });

    if (user && (await user.matchPassword(password))) {
      // Check if user is active
      if (user.status === false) {
         logger.warn(`Login attempt for inactive user: ${identifier}`);
         return res.status(403).send('Account is inactive. Please contact admin.');
      }

      // Check if role matches
      if (user.role !== role.toLowerCase() && user.role !== role) { 
         // Allow case insensitivity or exact match. stored roles are lowercase 'staff', 'admin' usually?
         // In User model: enum: ['admin', 'staff', 'student']
         // req.body.role might be 'Staff' (Capitalized)
         if (user.role !== role.toLowerCase()) {
             logger.warn(`Role mismatch for user ${identifier}. Expected ${role}, found ${user.role}`);
             return res.status(401).send('Invalid credentials (role mismatch)');
         }
      }

      req.session.user = {
        id: user._id,
        name: user.name || user.username,
        role: user.role,
        linkedId: user.referenceId, // Store linked Staff ID
      };

      logger.info(`User ${user.name || user.username} logged in successfully as ${user.role}.`);
      res.json({
        _id: user._id,
        name: user.name || user.username,
        role: user.role,
        linkedId: user.referenceId,
        isFirstLogin: user.isFirstLogin,
      });
    } else {
      logger.warn(`Failed login attempt for identifier: ${identifier}`);
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
