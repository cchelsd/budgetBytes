// Import dependencies
import express from 'express';
const app = express();

import path from 'path';

const __dirname = path.resolve();


// const path = require('path');
// const port = 3000;



app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the landingPage.html as the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landingPage.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
