const express = require("express");
const router = express.Router();
const dbConnection = require("../config");
let usersData = [];
let validIDs = [];
let recipes = [];
let resultArr = [];

router.get('/:userID', async (request, response) => {
    usersData = [];
    validIDs = [];
    recipes = [];
    resultArr = [];
    const userLogID = request.params.userID;
    await findSimilarUsers(userLogID, 'history');
    for (const validID of validIDs) {
        await fetchRecipeHistory(validID);
    }
    for (const innerArray of recipes) {
        for (const recipeObj of innerArray) {
            resultArr.push(recipeObj);
        }
    }
    if (resultArr.length === 0) {
        return response.status(400).json({message: "Recipes of other Budget Bytes users with your dietary preferences were not found."});
    }
    return response.status(200).json(resultArr);
});

router.get('/favorites/:userID', async (request, response) => {
    usersData = [];
    validIDs = [];
    recipes = [];
    resultArr = [];
    const userLogID = request.params.userID;
    findSimilarUsers(userLogID, 'favorite');
    for (const validID of validIDs) {
        await fetchFavorites(validID);
    }
    console.log("Valid IDs:", validIDs);
    for (const innerArray of recipes) {
        for (const recipeObj of innerArray) {
            resultArr.push(recipeObj);
        }
    }
    if (resultArr.length === 0) {
        return response.status(400).json({message: "Favorite recipes of other Budget Bytes users with your dietary preferences were not found."});
    }
    return response.status(200).json(resultArr);
});

async function getIDs(userID, table) {
    const response = await fetch(`http://localhost:3001/${table}/notUser`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'user-log-id': userID
        }
    });
    const data = response.json();
    return data;
}

async function findSimilarUsers(userID, table) {
    const data = await getIDs(userID, table);
    const idsArray = data.recordset;
    const ids = idsArray.map(id => id['userLogID']);
    const userData = await getUserPreferences(userID);
    let othersData;
    for (const id of ids) {
        othersData = await getUserPreferences(id);
        usersData.push(othersData.recordset[0]);
    }
    for (const data of usersData) {
        comparePreferences(userData.recordset[0], data);
    }
}

async function getUserPreferences(userID) {
    console.log(userID);
    const response = await fetch(`http://localhost:3001/user/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

function comparePreferences(obj1, obj2) {
    const keys = Object.keys(obj1).slice(0, 5);
    let isValid = true;
    keys.forEach(key => {
        if (obj1[key] === 'true' && obj2[key] !== 'true') {
            isValid = false;
            return;
        }
    });
    if (isValid) {
        validIDs.push(obj2['userLogID']);    
    } 
}

async function fetchRecipeHistory(userID) {
    console.log("Fetching History", userID)
    const response = await fetch(`http://localhost:3001/history`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'user-log-id': userID
        }
    });
    const history = await response.json();   
    const recipeHistory = history[0]; 
    console.log("recipes", recipeHistory);
    recipes.push(recipeHistory);
}

async function fetchFavorites(userID) {
    const response = await fetch(`http://localhost:3001/favorite`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'user-log-id': userID
        }
    });
    const data = await response.json();   
    const favoriteRecipes = data[0]; 
    recipes.push(favoriteRecipes);
}

module.exports = router