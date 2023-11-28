import express from 'express';
import cors from 'cors';  // Import CORS module
import { config } from './config.js';
import Database from './database.js';
import user from './user.js';  // Import App routes

const port = process.env.PORT || 3000;
var app = express();

app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Use express.json middleware to parse JSON request bodies

// Connect App routes
app.use('/user', user);

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});