const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'codeWorks';

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ msg: 'No token provided. Authorization denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token is invalid or expired.' });
  }
};
