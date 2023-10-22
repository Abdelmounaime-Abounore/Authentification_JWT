const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
    const token = req.cookies.jwtToken
    if (!token) {
        return res.status(401).json({ message: 'Not Authorized' });
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not Authorized' });
    }
}

module.exports = checkAuth