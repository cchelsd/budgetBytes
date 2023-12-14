const express = require("express");
const router = express.Router();
const dbConnection = require("../config");

/**
 * @swagger
 * /grocery/getLists:
 *   get:
 *     summary: Retrieve all users' grocery lists
 *     responses:
 *       200:
 *         description: List of all grocery lists
 *         content:
 *           application/json:
 *            example:
 *              result:
 *                userLogID: 1234
 *                itemName: carrots 
 *                itemQuantity: 12
 *                
 *       400:
 *         description: Error in SQL statement
 *         content:
 *           application/json:
 *            example:
 *              error: "Error in the SQL statement. Please check."
 *        
 */
router.get('/getLists', async (_, res) => {
  const sqlQuery = 'SELECT * FROM GroceryLists';
  const sqlRequest = dbConnection.request();
  sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return res.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    return res.status(200).json(result);
  }); 
});

/**
 * @swagger
 * /grocery/create:
 *   post:
 *     summary: Create a new grocery list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userLogID:
 *                 type: string
 *           example:
 *            userLogID: "1234"
 *     responses:
 *       200:
 *          description: Successfully created a grocery list
 *          content: 
 *            application/json:
 *             example: 
 *               Success: "Successfully created a grocery list for user!"
 *       500:
 *          description: Error creating the grocery list
 *          content: 
 *            application/json:
 *             example: 
 *               erorr: "Error creating grocery list."
 */
router.post('/create', async (req, res) => {
  const userLogID = req.body.userLogID;
  const sqlQuery = 'INSERT INTO GroceryLists (userLogID) VALUES (@userLogID)';
  const sqlRequest = dbConnection.request();
  sqlRequest.input('userLogID', userLogID);
  sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return res.status(500).json({ error: err?.message });
    }
    return res.status(200).json({Success: "Successfully created a grocery list for user!"});
  }); 
});

/**
 * @swagger
 * /grocery/{userLogID}:
 *   post:
 *     summary: Add an item to a user's grocery list
 *     parameters:
 *       - in: path
 *         name: userLogID
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
 *               itemName:
 *                 type: string
 *               itemQuantity:
 *                 type: integer
 *           example:
 *            itemName: "carrots"
 *            itemQuantity: 4
 *     responses:
 *       200:
 *         description: Item added to the grocery list
 *         content: 
 *           application/json:
 *            example:
 *              result:
 *                userLogID: 1010
 *                itemName: apples 
 *                itemQuantity: 6
 *       500:
 *         description: Error adding the item
 *         content: 
 *           application/json:
 *            example: 
 *              erorr: "Error adding item to grocery list."
 */
router.post('/:userLogID', async (req, res) => {
    const userLogID = req.params.userLogID;
    const itemName = req.body.itemName;
    const itemQuantity = req.body.itemQuantity;
    const sqlQuery = 'INSERT INTO GroceryLists (userLogID, itemName, itemQuantity) VALUES (@userLogID, @itemName, @itemQuantity)';
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userLogID);
    sqlRequest.input('itemName', itemName);
    sqlRequest.input('itemQuantity', itemQuantity);
    sqlRequest.query(sqlQuery, (err, result) => {
      if (err) {
          return res.status(500).json({ error: err?.message });
      }
      return res.status(200).json(result);
    }); 
});

/**
 * @swagger
 * /grocery/{userLogID}:
 *   get:
 *     summary: Retrieve a grocery list by User Log ID
 *     parameters:
 *       - in: path
 *         name: userLogID
 *         schema:
 *           type: string
 *         required: true
 *         description: User Log ID
 *         example:
 *          userLogID: 1010
 *     responses:
 *       200:
 *         description: Grocery list of the user
 *         content: 
 *           application/json:
 *            example:
 *              result:
 *                userLogID: 1332
 *                itemName: celery 
 *                itemQuantity: 2
 *       404:
 *         description: The user does not have a grocery list
 *         content: 
 *           application/json:
 *            example: 
 *              message: "User does not have a grocery list"
 *       500:
 *         description: Error fetching the grocery list
 *         content: 
 *           application/json:
 *            example: 
 *              error: "Error fetching the user's grocery list"
 */
router.get('/:userLogID', async (req, res) => { 
  const userLogID = req.params.userLogID;
  const sqlQuery = 'SELECT itemName, itemQuantity FROM GroceryLists WHERE userLogID = @userLogID';
  const sqlRequest = dbConnection.request();
  sqlRequest.input('userLogID', userLogID);
  sqlRequest.query(sqlQuery, (err, result) => {
    if ((result.rowsAffected)[0] == 0) {
      return res.status(404).json({ message: 'User does not have a grocery list' })
    } else if (err) {
      return res.status(500).json({ error: err?.message });   
    }
    return res.status(200).json(result);
  }); 
});

/**
 * @swagger
 * /grocery/{userLogID}:
 *   put:
 *     summary: Update quantity of an item in the grocery list
 *     parameters:
 *       - in: path
 *         name: userLogID
 *         schema:
 *           type: string
 *         required: true
 *         description: User Log ID
 *         example:
 *          userLogID: 1332
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *               itemQuantity:
 *                 type: integer
 *     responses:
 *       200:
 *          description: Item quantity updated
 *          content: 
 *            application/json:
 *             example: 
 *               Success: "Item was updated!"
 *       500:
 *          description: Error updating the item
 *          content: 
 *            application/json:
 *             example: 
 *               erorr: "Error updating item in grocery list."
 */
// Update quantity of an item
router.put('/:userLogID', async (req, res) => {
  const userLogID = req.params.userLogID;
  const itemName = req.body.itemName;
  const itemQuantity = req.body.itemQuantity;
  const sqlQuery = 'UPDATE GroceryLists SET userLogID = @userLogID, itemName = @itemName, itemQuantity = @itemQuantity WHERE userLogID = @userLogID AND itemName = @itemName';
  const sqlRequest = dbConnection.request();
  sqlRequest.input('userLogID', userLogID);
  sqlRequest.input('itemName', itemName);
  sqlRequest.input('itemQuantity', itemQuantity);
  sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return res.status(500).json({ error: err?.message });
    }
    return res.status(200).json({ Success: "Item was updated!" });
  }); 
});

/**
 * @swagger
 * /grocery/{userLogID}/{itemName}:
 *   delete:
 *     summary: Remove an item from the user's grocery list
 *     parameters:
 *       - in: path
 *         name: userLogID
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemName
 *         schema:
 *           type: string
 *         example:
 *          userLogID: 1234
 *          itemName: carrots
 *     responses:
 *       200:
 *          description: Item deleted from the grocery list
 *          content: 
 *            application/json:
 *             example: 
 *               Success: "itemName was updated!"
 *       500:
 *          description: Error deleting the item
 *          content: 
 *            application/json:
 *             example: 
 *               erorr: "Error deleting item from grocery list."
 */
router.delete('/:userLogID/:itemName', async (req, res) => {
  const userLogID = req.params.userLogID;
  const itemToDelete = req.params.itemName;
  const sqlQuery = 'DELETE FROM GroceryLists WHERE userLogID = @userLogID AND itemName = @itemName';
  const sqlRequest = dbConnection.request();
  sqlRequest.input('userLogID', userLogID);
  sqlRequest.input('itemName', itemToDelete);
  sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return res.status(500).json({ error: err?.message });
    }
    return res.status(200).json({ Success: `${itemToDelete} was deleted!` });
  }); 
});

/**
 * @swagger
 * /grocery/{userLogID}:
 *   delete:
 *     summary: Delete the entire grocery list of a user
 *     parameters:
 *       - in: path
 *         name: userLogID
 *         schema:
 *           type: string
 *         example:
 *          userLogID: 1332
 *     responses:
 *       200:
 *          description: Grocery list deleted
 *          content: 
 *            application/json:
 *             example: 
 *               Success: "Grocery list was deleted!"
 *       500:
 *          description: Error deleting the grocery list
 *          content: 
 *            application/json:
 *             example: 
 *               erorr: "Error deleting user's grocery list."
 */
router.delete('/:userLogID', async (req, res) => {
  const userLogID = req.params.userLogID;
  const sqlQuery = 'DELETE FROM GroceryLists WHERE userLogID = @userLogID';
  const sqlRequest = dbConnection.request();
  sqlRequest.input('userLogID', userLogID);
  sqlRequest.query(sqlQuery, (err, result) => {
    if (err) {
        return res.status(500).json({ error: err?.message });
    }
    return res.status(200).json({ Success: `Grocery list was deleted!` });
  }); 
});

module.exports = router;