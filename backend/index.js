// ----------------------------------------------
// retrieve necessary files
const express = require("express");
const cors = require("cors");
const favoriteRoutes = require("./routes/favoriteRoutes");
const userRoutes = require("./routes/userRoutes");
const savedRoutes = require("./routes/savedRoutes");
const historyRoutes = require("./routes/historyRoutes");

const port = 3001;

// var bodyParser = require('body-parser');

// // ----------------------------------------------
// // (A)  Create an express application instance
// //      and parses incoming requests with JSON
// //      payloads
// // ----------------------------------------------
var app = express(); 
app.use(express.json());

// // ----------------------------------------------
// // (B)  Use the epxress cors middleware
// //      Cross-origin resource sharing (CORS)
// //      is a technique that restricts specified
// //      resources within web page to be accessed
// //      from other domains on which the origin
// //      resource was initiated the HTTP request
// //      Also use the bodyParser to parse in 
// //      format the body of HTTP Requests
// // ----------------------------------------------
app.use(cors());
// app.use(bodyParser.json());

// // ----------------------------------------------
// // Use the defined routes for services 1 and 2
// // The routes are prefixed with '/attractions'
// // ----------------------------------------------
app.use('/favorite', favoriteRoutes);
app.use('/user', userRoutes);
app.use('/saved', savedRoutes);
app.use('/history', historyRoutes);

app.listen(port, () => {
    console.log(`Express server is running and listening on port ${port}`);
}); 