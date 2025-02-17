// const authorizeAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') return res.status(403).json({ message: "Access forbidden" });
//     next();
//   };
  
//   module.exports = authorizeAdmin;

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authorization middleware
const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get token from the Authorization header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).send({ error: 'No token provided, not authorized' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from the decoded token
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      // Check if the user's role is in the allowedRoles array
      if (!allowedRoles.includes(user.role)) {
        console.log("useruu", user);
        console.log("allowedRoles", allowedRoles);
        return res.status(403).send({ error: 'Forbidden: You do not have permission to access this resource' });
      }

      // If authorized, attach user to the request object and continue
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: 'Not authorized to access this resource' });
    }
  };
};

module.exports = authorize;
  