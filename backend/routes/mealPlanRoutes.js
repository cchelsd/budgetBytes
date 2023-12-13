const express = require("express");
const router = express.Router();
const dbConnection = require("../config");
let notFound = false;

// Get 7 random recipes from user favorites
router.get('/favorite/:userID', async (request, response) => {
    const userLogID = request.params.userID;
    const sqlQuery = 'SELECT TOP 7 * FROM favorites WHERE userLogID = @userLogID ORDER BY NEWID()'
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error fetching recipes"});
    }
    return response.status(200).json(parseRecipeJSON(result));
    }); 
});

// Get 7 random recipes from users saved
router.get('/saved/:userID', async (request, response) => {
    const userLogID = request.params.userID;
    const sqlQuery = 'SELECT TOP 7 * FROM savedRecipes WHERE userLogID = @userLogID ORDER BY NEWID()'
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error fetching recipes"});
    }
    return response.status(200).json(parseRecipeJSON(result));
    }); 
});

// Get 7 random recipes from users history
router.get('/history/:userID', async (request, response) => {
    const userLogID = request.params.userID;
    const sqlQuery = 'SELECT TOP 7 * FROM recipeHistory WHERE userLogID = @userLogID ORDER BY NEWID()'
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error fetching recipes"});
    }
    return response.status(200).json(parseRecipeJSON(result));
    }); 
});

// Get 7 random recipes from all budget bytes recipe history
router.get('/all', async (request, response) => {
    const sqlQuery = 'SELECT TOP 7 * FROM recipeHistory ORDER BY NEWID()'
    const sqlRequest = dbConnection.request();
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error fetching"});
    }
    return response.status(200).json(parseRecipeJSON(result));
    }); 
});

// Get 7 random recipes from other users' history
router.get('/preference/all/:userID', async (request, response) => {
    notFound = false;
    const userLogID = request.params.userID;
    const history = await fetchAllRecipes(userLogID);
    if (!notFound) {
        const shuffled = history.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 7);
        let recipesArr = [[...selected]];
        return response.status(200).json(recipesArr);
    }
    return response.status(400).json({message: "Recipes of other Budget Bytes users with your dietary preferences were not found."});
});

// Get 7 random recipes from other users' favorites
router.get('/preference/favorites/:userID', async (request, response) => {
    notFound = false;
    const userLogID = request.params.userID;
    const favorites = await fetchFavorites(userLogID);
    if (!notFound) {
        const shuffled = favorites.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 7);
        let recipesArr = [[...selected]];
        return response.status(200).json(recipesArr);
    }
    return response.status(400).json({message: "Favorite Recipes of other Budget Bytes users with your dietary preferences were not found."});
});

async function fetchAllRecipes(userID) {
    const response = await fetch(`http://localhost:3001/explore/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();  
    if (response.status === 400) {
        notFound = true;
        return;
    } 
    return data;
}

async function fetchFavorites(userID) {
    const response = await fetch(`http://localhost:3001/explore/favorites/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();   
    if (response.status === 400) {
        notFound = true;
        return;
    }
    return data;
}

function parseRecipeJSON(data) {
    return data.recordsets.map(recordset =>
        recordset.map(item => ({
        ...item,
        recipe: JSON.parse(item.recipe)
        }))
    );
}

module.exports = router;