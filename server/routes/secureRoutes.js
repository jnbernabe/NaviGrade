// routes/secureRoutes.js
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// A secure route that requires authentication
router.get('/secure-route', authenticateToken, (req, res) => {
  // Access the authenticated user using req.user
  res.json({ message: 'This is a secure route', user: req.user });
});

module.exports = router;
