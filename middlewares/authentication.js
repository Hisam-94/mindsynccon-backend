const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).send({ error: 'No authentication token provided' });
    }

    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the ID decoded from the token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Attach user information to the request object
    req.user = user;
    next();
  } catch (error) {
    // Differentiate between JWT errors and other errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired' });
    }

    res.status(500).send({ error: 'Authentication failed' });
  }
};

module.exports = auth;
