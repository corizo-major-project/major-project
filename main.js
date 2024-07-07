require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const db = require("./config/db");
const Product = require("./models/Products");
const Review = require("./models/Reviews");
const multer = require('multer');

//app
const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
db.once('open', () => {
    console.log('Database connection is open.');
});

const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
4
app.use(express.static('views'));
app.use(express.static('logo'));

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));
app.use('/uploads', express.static('uploads'));
// Set Template Engine
app.set("view engine", "ejs");

// Routes
app.use("/", require("./routes/routes"));

app.listen(PORT, () => {
    console.log(`Server Started at Port: ${PORT}`);
});
