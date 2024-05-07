const secret = "1a38fe7df56879d685e51b6f0ff86327";
const jsonwebtoken = require('jsonwebtoken');

function generateToken(user) {
  return jsonwebtoken.sign(user, secret, { expiresIn: '1m' });
}

function verifyToken(token) {
  return jsonwebtoken.verify(token, secret);
} 

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }
  verifyToken(token, (err) => {
    if (err) {
      return res.sendStatus(403);
    }
    
    next();
  });
}

module.exports = { generateToken, authenticateToken };