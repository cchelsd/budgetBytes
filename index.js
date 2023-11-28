import express from 'express';
// import cors from 'cors'; // Import CORS module

// Import your configuration and database modules
import { config } from './config.js';
import Database from './database.js';

// Import App routes
import user from './user.js';

// Set the port from the environment or default to 3000
const port = process.env.PORT || 3000;

// Create an Express app
const app = express();

// Use CORS to allow requests from different origins (if your frontend is hosted separately)
app.use(cors());

// Use express.json middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from 'public' directory (if you have a front-end in the same project)
app.use(express.static('public'));

// Connect your routes
app.use('/user', user);

// A simple test route to check server status
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
