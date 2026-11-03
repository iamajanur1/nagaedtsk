const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const match = /^Bearer (\S+)$/i.exec(authorization);

  if (!match) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    if (!Number.isSafeInteger(payload.id) || payload.id <= 0) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.userId = payload.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
