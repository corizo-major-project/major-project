const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const adminToken = req.cookies.admin_jwt;
    const userToken = req.cookies.user_jwt;
    
    // Check admin token first
    if (adminToken) {
        jwt.verify(adminToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Error verifying admin token:', err);
                return res.status(401).redirect('/login');
            }
            req.user = decoded; // Set user information in request
            next();
        });
    } else if (userToken) {
        // Check user token if no admin token found
        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Error verifying user token:', err);
                return res.status(401).redirect('/login');
            }
            req.user = decoded; // Set user information in request
            next();
        });
    } else {
        // Redirect to login if no token found
        res.redirect('/login');
    }
};

module.exports = verifyToken;
