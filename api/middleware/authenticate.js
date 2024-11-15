const jwt = require('jsonwebtoken');
const tokenBlacklist = new Set();  // Assuming this is where you store blacklisted tokens
const secretKey = process.env.SECRET_KEY || 'your_default_secret_key'; // Load from environment or use default

// Middleware to check for blacklisted tokens
const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticate;
