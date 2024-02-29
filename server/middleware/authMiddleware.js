// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Received token:', token);

  if (!token) {
    console.error('Access denied: No token provided');
    return res.status(401).json({ message: 'Access denied' });
  }

  const secretKey = process.env.JWT_SECRET || 'Zht6Nvy7Yr9Qp7KAlAIU8GzPqLUrzTSK';

  // Remove the 'Bearer ' prefix and trim whitespaces
  const cleanedToken = token.replace('Bearer ', '').trim();

  jwt.verify(cleanedToken, secretKey, (err, decoded) => {
    if (err) {
      // Log the decoded token for further inspection
      console.error('Decoded token:', decoded);
      console.error('Error during verification:', err);

      if (err.name === 'TokenExpiredError') {
        console.error('Token has expired');
        return res.status(403).json({ message: 'Token has expired' });
      }

      console.error('Invalid token:', err.message);
      return res.status(403).json({ message: 'Invalid token', error: err.message });
    }

    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken };
