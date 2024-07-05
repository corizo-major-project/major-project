const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.renderLoginForm = (req, res) => {
    // Check if there is an error message passed in the query parameters
    const { error } = req.query;
    res.render("login", { title: "Login", error });
};



exports.userRegister = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname, gender, phone } = req.body;
        console.log({ username, email, password, firstname, lastname, gender, phone });
        // Check if empID or email already exist in the database
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // If not found, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ userName: username, email, password: hashedPassword, firstName: firstname, lastName: lastname, gender, phone, role: "USER" });
        await user.save();
        
        res.redirect("/login");
    } catch (error) {
        return res.status(500).json({ error: 'Registration failed', error });
    }
}
//
exports.userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if empID and password are provided
        if (!username || !password) {
            return res.status(400).redirect('/login?error=' + encodeURIComponent('Please provide username and password'));
        }
        
        // Find user by empID
        const user = await User.findOne({ userName: username });
 
        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).redirect('/login?error=' + encodeURIComponent('Invalid username or password'));
        }
        
        // Extract designation from user object
        const { role } = user;
        
        // Generate JWT token
        const token = jwt.sign({ userId: user._id, userName: user.userName, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Set token in cookie
        res.cookie('jwt', token, { httpOnly: true });

        // Redirect to dashboard or any other page
        if(role === "ADMIN"){
            return res.redirect("/admin");
        }
        return res.redirect("/user");
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).redirect('/login?error=' + encodeURIComponent('Internal server error'));
    }
};



exports.renderSignupForm = (req, res) => {
    res.render("signup", { title: "Sign Up" });
};

exports.logouthandle = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
};