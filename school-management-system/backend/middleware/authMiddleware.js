const protect = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('Not authorized, no session');
  }
};

module.exports = { protect };
