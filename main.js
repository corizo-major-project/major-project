require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
db.once('open', () => {
    console.log('Database connection is open.');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('views'));

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

// Set Template Engine
app.set("view engine", "ejs");

// Routes
app.use("/", require("./routes/routes"));
app.use('/auth', require('./routes/authRoutes'));

app.listen(PORT, () => {
    console.log(`Server Started at Port: ${PORT}`);
});
