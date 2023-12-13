// ----------------------------------------------
// retrieve necessary files
const express = require("express");
const cors = require("cors");
const favoriteRoutes = require("./routes/favoriteRoutes");
const userRoutes = require("./routes/userRoutes");
const savedRoutes = require("./routes/savedRoutes");
const historyRoutes = require("./routes/historyRoutes");
const exploreRoutes = require("./routes/exploreRoutes");
const wordCountRoutes = require("./routes/wordSearchRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const storeRoutes = require("./routes/groceryStoreRoutes");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const port = 3000;

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

// ----------------------------------------------
// Define Swagger JSDoc configuration
// ----------------------------------------------
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Budget Bytes",
        version: "1.0.0",
        description: "API documentation for your Express.js application",
      },
      servers: [`http://localhost:${port}`],
    },
    apis: ["./backend/routes/*.js"], // Path to the API routes
};

// ----------------------------------------------
// Initialize Swagger JSDoc
// ----------------------------------------------
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// ----------------------------------------------
// Serve Swagger documentation
// ----------------------------------------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// app.use(bodyParser.json());

// // ----------------------------------------------
// // Use the defined routes for services 1 and 2
// // The routes are prefixed with '/attractions'
// // ----------------------------------------------
app.use('/favorite', favoriteRoutes);
app.use('/user', userRoutes);
app.use('/saved', savedRoutes);
app.use('/history', historyRoutes);
app.use('/groceryList', groceryRoutes);
app.use('/search', wordCountRoutes);
app.use('/mealplan', mealPlanRoutes);
app.use('/explore', exploreRoutes);
app.use('/assess', assessmentRoutes);
app.use('/stores', storeRoutes);

app.listen(port, () => {
    console.log(`Express server is running and listening on port ${port}`);
}); 
