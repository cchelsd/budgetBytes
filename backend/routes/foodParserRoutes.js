const express = require('express');
const router = express.Router();


// Define the route for food parsing
router.get('/', async (req, res) => {
    const { ingr } = req.query;

    try {
        // Fetch data directly from the Edamam API using a GET request
        const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(ingr)}&app_id=aecae770&app_key=c7a908a263b49dd16f16fe5ed1f7065e`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Parse the JSON response
        const data = await response.json();

        // Check if the response has the "parsed" property and "food" array
        if (data.parsed && data.parsed.length > 0) {
            // Access the nutrients property of the first item in the "parsed" array
            const nutrients = data.parsed[0].food.nutrients;

            // Respond with nutrient values
            res.json({ nutrients });
        } else {
            res.status(404).json({ error: 'No parsed data found.' });
        }
    } catch (error) {
        // Handle errors and send an error response
        console.error(error);
        res.status(500).json({ error: 'Error occurred during food parsing.' });
    }
});

// Export the router
module.exports = router;