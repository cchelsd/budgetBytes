const express = require("express");
const router = express.Router();
const dbConnection = require("../config");
let usersData = [];
let validIDs = [];
let recipes = [];
let resultArr = []

router.get('/:userID', async (request, response) => {
    usersData = [];
    validIDs = [];
    recipes = [];
    const userLogID = request.params.userID;
    const sqlRequest = dbConnection.request();
    const sqlQuery = "SELECT DISTINCT userLogID FROM recipeHistory WHERE userLogID <> @userLogID";
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, async (err, result) => {
        if (err) {
            return response.status(400).json({Error: "Error in the SQL statement. Please check."});
        }
        const parsedRes = parseJSON(result);
        const idsArray = parsedRes[0];
        const ids = idsArray.map(id => id['userLogID']);
        const userData = await getUserPreferences(userLogID);
        let othersData;
        for (const id of ids) {
            othersData = await getUserPreferences(id);
            usersData.push(othersData.recordset[0]);
        }
        for (const data of usersData) {
            await comparePreferences(userData.recordset[0], data);
        }   
        for (const validID of validIDs) {
            await fetchRecipeHistory(validID);
        }
        console.log("Valid IDs:", validIDs);
        for (const innerArray of recipes) {
            for (const recipeObj of innerArray) {
              resultArr.push(recipeObj);
            }
        }
        return response.status(200).json(resultArr);
    }); 
});

router.get('/favorites/:userID', async (request, response) => {
    usersData = [];
    validIDs = [];
    recipes = [];
    const userLogID = request.params.userID;
    findSimilarUsers(userLogID, 'favorites');
    for (const validID of validIDs) {
        await fetchFavorites(validID);
    }
    console.log("Valid IDs:", validIDs);
    for (const innerArray of recipes) {
        for (const recipeObj of innerArray) {
            resultArr.push(recipeObj);
        }
    }
    return response.status(200).json(resultArr);
});

async function getIDs(userID, table) {
    const sqlRequest = dbConnection.request();
    const sqlQuery = `SELECT DISTINCT userLogID FROM ${table} WHERE userLogID <> @userLogID`;
    sqlRequest.input('userLogID', userID);
    sqlRequest.query(sqlQuery, async (err, result) => {
        if (err) {
            return response.status(400).json({Error: "Error in the SQL statement. Please check."});
        }
        return response.status(200).json(parseJSON(result));
    });
}

async function findSimilarUsers(userID, table) {
    const parsedRes= await getIDs(userID, table);
    const idsArray = parsedRes[0];
    const ids = idsArray.map(id => id['userLogID']);
    const userData = await getUserPreferences(userLogID);
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
    const response = await fetch(`http://localhost:3001/user/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

function comparePreferences(obj1, obj2) {
    const keys = Object.keys(obj1);
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
    const response = await fetch(`http://localhost:3001/history`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'user-log-id': userID
        }
    });
    const history = await response.json();   
    const recipeHistory = history[0]; 
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

function parseJSON(data) {
    return data.recordsets.map(recordset => recordset.map(item => ({...item})));
}

module.exports = router;