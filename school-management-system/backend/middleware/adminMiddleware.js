const admin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(401).send('Not authorized as an admin');
  }
};

module.exports = { admin };
