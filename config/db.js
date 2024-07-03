// Importing the 'mongoose' library for MongoDB interaction.
const mongoose = require('mongoose');

// Importing the 'dotenv' library to load environment variables from a .env file.
require('dotenv').config();

// Retrieving the MongoDB connection URI from the environment variables.
const uri = process.env.DB_URL;

// Configuration options for the MongoDB connection.
const options = {
  //useNewUrlParser: true,        // Use the new URL parser.
  //useUnifiedTopology: true,    // Use the new Server Discovery and Monitoring engine.
};

// Establishing a connection to the MongoDB database using Mongoose.
mongoose.connect(uri, options)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB.', err));

// Accessing the mongoose.connection object for additional configuration or event handling.
const db = mongoose.connection;

// Exporting the mongoose.connection object to be used elsewhere in the application.
module.exports = db;
