const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '123456');
    
    // Set the full user object with the correct ID field
    req.user = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role
    };
    
    console.log('Decoded user:', req.user);
    next();
  } catch (error) {
    console.log('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
