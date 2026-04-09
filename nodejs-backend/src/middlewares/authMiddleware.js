const { verifyToken } = require('../utils/jwt');
const logger = require('../logger');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token not provided',
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }

  next();
};

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
