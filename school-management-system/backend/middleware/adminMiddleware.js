const logger = require('../config/logger');

const admin = (req, res, next) => {
  if (req.session && req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'Admin')) {
    next();
  } else {
    logger.warn(`Admin access denied. Session: ${!!req.session}, User: ${!!req.session?.user}, Role: ${req.session?.user?.role}`);
    res.status(401).send('Not authorized as an admin');
  }
};

module.exports = { admin };
