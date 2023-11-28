const express = require("express");
const router = express.Router();
const dbConnection = require("../config");

router.get('/', async (request, response) => {
    const sqlQuery = "SELECT * FROM favorites;";
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    return response.status(200).json(result.recordsets);
    }); 
});

router.post('/', async (request, response) => {
    const id = request.body.id;
    const recipe = request.body.recipe;
    const sqlQuery = 'INSERT INTO favorites (id, recipe) VALUES (@id, @recipe)';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('id', id);
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
    const id = request.params.id;
    const sqlQuery = `DELETE FROM favorites WHERE id = ${id}`;
    const sqlRequest = dbConnection.request();
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            return response.status(400).json({ Error: "Record was not deleded." });
        } else {
            return response.status(200).json({ Success: "Record was deleted!" });
        }
    }); 
});

module.exports = router;