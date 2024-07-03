const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true},
    lastName: {type: String, required: true},
    gender: {type: String, required: true, enum: ["MALE", "FEMALE", "OTHERS"]},
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Simple regex to validate phone numbers
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    role: {type: String, required: true, enum: ["ADMIN","USER"]}
 });
 
module.exports = mongoose.model('User', userSchema);