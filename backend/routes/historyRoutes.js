const express = require("express");
const router = express.Router();
const dbConnection = require("../config");

router.get('/', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = "SELECT * FROM recipeHistory WHERE userLogID = @userLogID;";
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({Error: "Error in the SQL statement. Please check."});
        }
        return response.status(200).json(parseRecipeJSON(result));
    }); 
});

router.post('/', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const recipeID = request.body.id;
    const recipe = request.body.recipe;
    console.log(request.body);
    const sqlQuery = 'INSERT INTO recipeHistory (userLogID, recipeID, recipe) VALUES (@userLogID, @recipeID, @recipe)';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('recipeID', recipeID);
    sqlRequest.input('recipe', recipe);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({ Error: "Record was not added." });
        } else {
            return response.status(200).json({ Success: "Record was added!" });
        }
    }); 
});

router.get('/notUser', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = "SELECT DISTINCT userLogID FROM recipeHistory WHERE userLogID <> @userLogID;";
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    return response.status(200).json(result);
    }); 
});

router.get('/all', async (request, response) => {
    const sqlQuery = "SELECT * FROM recipeHistory";
    const sqlRequest = dbConnection.request();
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({Error: "Error in the SQL statement. Please check."});
        }
        return response.status(200).json(parseRecipeJSON(result));
    });
});

//updated it to prevent the JSON.parse from failing when the recipe field is not a valid JSON string
function parseRecipeJSON(data) {
    try {
        return data.recordsets.map(recordset =>
            recordset
                .filter(item => isValidJSON(item.recipe))
                .map(item => ({
                    ...item,
                    recipe: JSON.parse(item.recipe)
                }))
        );
    } catch (error) {
        console.error('Error parsing JSON:', error);
        console.log('Data:', data);
        return [];
    }
}

// Helper function to check if a string is a valid JSON
function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = router;