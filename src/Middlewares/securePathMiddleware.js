const jwt = require('jsonwebtoken');
const { SECRET } = require('../Config/vars.js');

exports.securePathMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({message: 'Access denied'});
    try {
        const verified = jwt.verify(token, SECRET);
        req.tokenInfo = verified;
        next();
    } catch (error) {
        res.status(400).json({message: 'Invalid token'});
    }
}