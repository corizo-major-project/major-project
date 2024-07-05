const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).redirect('/login?error=' + encodeURIComponent('Please log in to view this page'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded; // This makes the user available in EJS templates
        next();
    } catch (error) {
        return res.status(401).redirect('/login?error=' + encodeURIComponent('Invalid or expired token, please log in again'));
    }
};

module.exports = verifyToken;
