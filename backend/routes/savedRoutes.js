const express = require("express");
const router = express.Router();
const dbConnection = require("../config");

router.get('/', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = 'SELECT * FROM savedRecipes WHERE userLogID = @userLogID;';
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    return response.status(200).json(result.recordsets);
    }); 
});

router.post('/', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const recipeID = request.body.id;
    const recipe = request.body.recipe;
    const sqlQuery = 'INSERT INTO savedRecipes (userLogID, recipeID, recipe) VALUES (@userLogID, @recipeID, @recipe)';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('recipeID', recipeID);
    sqlRequest.input('recipe', recipe);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({ Error: "Recipe was not added." });
        } else {
            return response.status(200).json({ Success: "Recipe was added!" });
        }
    }); 
});

router.get('/collection', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const collection = request.body.collection;
    const sqlQuery = 'SELECT * FROM savedRecipes WHERE userLogID = @userLogID AND collection = @collection;';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('collection', collection);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({Error: "Error in the SQL statement. Please check."});
        }      
        return response.status(200).json(result.recordsets);
    }); 
}); 

router.put('/collection/:recipeID', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const recipeID = request.params.recipeID;
    const sqlQuery = 'UPDATE savedRecipes SET collection = @collection WHERE recipeID = @recipeID AND userLogID = @userLogID';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('collection', '');
    sqlRequest.input('recipeID', recipeID);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({Error: "Error in the SQL statement. Please check."});
        }      
        return response.status(200).json(result.recordsets);
    }); 
}); 

router.put('/recipe/:recipeID', async (request, response) => {
    const recipeID = request.params.recipeID;
    const userLogID = request.headers['user-log-id'];
    const collection = request.body.collection;
    const sqlQuery = 'UPDATE savedRecipes SET collection = @collection WHERE recipeID = @recipeID AND userLogID = @userLogID';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('collection', collection);
    sqlRequest.input('recipeID', recipeID);
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({ Error: "Record was updated." });
        } else {
            return response.status(200).json({ Success: "Record was not updated!" });
        }
    }); 
});

router.delete('/recipe/:recipeID', async (request, response) => {
    const recipeID = request.params.recipeID;
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = 'DELETE FROM savedRecipes WHERE recipeID = @recipeID AND userLogID = @userLogID';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('recipeID', recipeID);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({ Error: "Recipe was not deleded." });
        } else {
            return response.status(200).json({ Success: "Recipe was deleted!" });
        }
    }); 
});

module.exports = router;