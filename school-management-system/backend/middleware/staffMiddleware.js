const staff = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'staff') {
    next();
  } else {
    res.status(401).send('Not authorized as staff');
  }
};

module.exports = { staff };
