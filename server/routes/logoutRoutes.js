// routes/logout.js

const express = require('express');
const router = express.Router();
const tokenBlacklist = [];

// Middleware to check if the token is blacklisted
const checkTokenBlacklist = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token && tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: 'Token revoked' });
  }

  // Token is not blacklisted, continue processing the request
  next();
};

// Logout route
router.post('/', checkTokenBlacklist, (req, res) => {
   const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Add the token to the blacklist
  tokenBlacklist.push(token);

  res.json({ message: 'Logout successful' });
});

module.exports = router;