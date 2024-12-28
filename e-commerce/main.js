require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/db");
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

db.once('open', () => {
    console.log('Database connection is open.');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");

app.use("/", require("./routes/routes"));

app.listen(PORT, () => {
    console.log(`Server Started at Port: ${PORT}`);
});

