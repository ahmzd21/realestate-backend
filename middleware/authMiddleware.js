// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token and attach to request object
      // .select('-password') prevents fetching the password hash
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Not authorized, token failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware for checking user roles (optional, but good for future)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) { // Assuming you add a 'role' field to your User model later
      return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'unauthorized'} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };