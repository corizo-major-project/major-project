const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.userRegister = async (req, res) => {
    try {
        const { userName, email, password, firstName, lastName, gender, phone } = req.body;
        
        // Check if empID or email already exist in the database
        const existingUser = await User.findOne({ $or: [{ userName }, { email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // If not found, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ userName, email, password: hashedPassword, firstName, lastName, gender, phone, role: "USER" });
        await user.save();
        
        res.redirect("/");
    } catch (error) {
        return res.status(500).json({ error: 'Registration failed', error });
    }
}
//
exports.userLogin = async (req, res) => {
    try {
        const { userName, password } = req.body;
        
        // Check if empID and password are provided
        if (!userName || !password) {
            return res.status(400).json({ error: 'No Fields Provided' });
        }
        
        // Find user by empID
        const user = await User.findOne({ userName });
 
        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        // Extract designation from user object
        const { role } = user;
        
        // Generate JWT token
        const token = jwt.sign({ userId: user._id, userName: user.userName, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Send token and designation in response
        return res.status(200).json({ token: token });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};