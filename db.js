// Import env vars
const {connectionString} = require('./config');

// Import the mongoose module
const mongoose = require("mongoose");

// Set up the default mongoose connection
mongoose.connect(`${connectionString}`, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));