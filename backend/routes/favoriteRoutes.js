const express = require("express");
const router = express.Router();
const dbConnection = require("../config");

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Retrieve all favorite recipes for a specific user
 *     parameters:
 *       - in: header
 *         name: user-log-id
 *         schema:
 *           type: string
 *         required: true
 *         description: User Log ID
 *     responses:
 *       200:
 *         description: List of favorite recipes for the user
 *       400:
 *         description: Error in SQL statement
 */
router.get('/', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = "SELECT * FROM favorites WHERE userLogID = @userLogID ORDER BY CAST (recipeID as BIGINT) DESC;";
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    response.setHeader('X-Faves-Of', userLogID);
    return response.status(200).json(parseRecipeJSON(result));
    }); 
});

/**
 * @swagger
 * /favorites/all:
 *   get:
 *     summary: Retrieve all favorite recipes across all users
 *     parameters:
 *       - in: header
 *         name: user-log-id
 *         schema:
 *           type: string
 *         required: true
 *         description: User Log ID
 *     responses:
 *       200:
 *         description: List of all favorite recipes
 *       400:
 *         description: Error in SQL statement
 */
router.get('/all', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = "SELECT * FROM favorites ORDER BY CAST (recipeID as BIGINT) DESC;";
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    response.setHeader('X-Faves-All', 'every users faves');
    return response.status(200).json(parseRecipeJSON(result));
    }); 
});

/**
 * @swagger
 * /favorites/notUser:
 *   get:
 *     summary: Retrieve user IDs of all users except the requesting user from favorites
 *     parameters:
 *       - in: header
 *         name: user-log-id
 *         schema:
 *           type: string
 *         required: true
 *         description: User Log ID
 *     responses:
 *       200:
 *         description: List of user IDs from favorites
 *       400:
 *         description: Error in SQL statement
 */
router.get('/notUser', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = "SELECT DISTINCT userLogID FROM favorites WHERE userLogID <> @userLogID;";
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    response.setHeader('X-Exclude-Faves-ID', userLogID);
    return response.status(200).json(result);
    }); 
});

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add a new favorite recipe for a user
 *     parameters:
 *       - in: header
 *         name: user-log-id
 *         schema:
 *           type: string
 *         required: true
 *         description: User Log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               recipe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favorite recipe added successfully
 *       400:
 *         description: Error adding the favorite recipe
 */
router.post('/', async (request, response) => {
    const userLogID = request.headers['user-log-id'];
    const recipeID = request.body.id;
    const recipe = request.body.recipe;
    const sqlQuery = 'INSERT INTO favorites (userLogID, recipeID, recipe) VALUES (@userLogID, @recipeID, @recipe)';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('recipeID', recipeID);
    sqlRequest.input('recipe', recipe);
    response.setHeader('X-Add-Fave', recipeID);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({ Error: "Record was not added." });
        } else {
            return response.status(200).json({ Success: "Record was added!" });
        }
    }); 
});

/**
 * @swagger
 * /favorites/{id}:
 *   delete:
 *     summary: Delete a favorite recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Recipe ID
 *       - in: header
 *         name: user-log-id
 *         schema:
 *           type: string
 *         required: true
 *         description: User Log ID
 *     responses:
 *       200:
 *         description: Favorite recipe deleted successfully
 *       400:
 *         description: Error deleting the favorite recipe
 */
router.delete('/:id', async (request, response) => {
    const recipeID = request.params.id;
    const userLogID = request.headers['user-log-id'];
    const sqlQuery = `DELETE FROM favorites WHERE recipeID = @recipeID AND userLogID = @userLogID`;
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('recipeID', recipeID);
    response.setHeader('X-Delete-Fave', recipeID);
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