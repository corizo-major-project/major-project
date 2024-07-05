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

        // Authenticate user
        const user = await User.findOne({ userName: username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).redirect('/login?error=' + encodeURIComponent('Invalid username or password'));
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, userName: user.userName, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in cookie based on role
        if (user.role === "ADMIN") {
            res.cookie('admin_jwt', token, { httpOnly: true });
            return res.redirect("/admin");
        } else {
            res.cookie('user_jwt', token, { httpOnly: true });
            return res.redirect("/user");
        }
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