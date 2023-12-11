const express = require("express");
const router = express.Router();
const dbConnection = require("../config");

router.get('/', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = "SELECT * FROM favorites WHERE userLogID = @userLogID ORDER BY CAST (recipeID as BIGINT) DESC;";
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    return response.status(200).json(parseRecipeJSON(result));
    }); 
});

router.get('/notUser', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = "SELECT * FROM favorites WHERE userLogID <> @userLogID;";
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
    const sqlQuery = 'INSERT INTO favorites (userLogID, recipeID, recipe) VALUES (@userLogID, @recipeID, @recipe)';
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

router.delete('/:id', async (request, response) => {
    const recipeID = request.params.id;
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = `DELETE FROM favorites WHERE recipeID = @recipeID AND userLogID = @userLogID`;
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('recipeID', recipeID);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({ Error: "Record was not deleded." });
        } else {
            return response.status(200).json({ Success: "Record was deleted!" });
        }
    }); 
});

function parseRecipeJSON(data) {
    return data.recordsets.map(recordset =>
        recordset.map(item => ({
        ...item,
        recipe: JSON.parse(item.recipe)
        }))
    );
}

module.exports = router;