exports.isAdminMiddleware = (req, res, next) => {
    if (req.tokenInfo.role !== 'ADMIN') 
    return res.status(403).json({message: 'Access denied'});
    next();
};