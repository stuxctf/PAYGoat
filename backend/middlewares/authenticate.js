const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized access' });

    
    const decoded = jwt.decode(token);

    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    req.user = decoded;
    next();
};

module.exports = authenticate;
