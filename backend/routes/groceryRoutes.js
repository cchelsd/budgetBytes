const express = require("express");
const router = express.Router();
const dbConnection = require("../config");
const groceryData = require('../groceryDatabase');

// Get all users' grocery lists
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

// Create grocery list
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

// Add item to user's grocery list
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

// Get grocery list by userLogID
router.get('/:userLogID', async (req, res) => { 
  const userLogID = req.params.userLogID;
  const sqlQuery = 'SELECT itemName, itemQuantity FROM GroceryLists WHERE userLogID = @userLogID';
  const sqlRequest = dbConnection.request();
  sqlRequest.input('userLogID', userLogID);
  sqlRequest.query(sqlQuery, (err, result) => {
    if ((result.rowsAffected)[0] == 0) {
      return res.status(404).json({ message: 'User\'s does not have a grocery list' })
    } else if (err) {
      return res.status(500).json({ error: err?.message });   
    }
    return res.status(200).json(result);
  }); 
});

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
    return res.status(201).json(result);
  }); 
});

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

// Remove item from user's grocery list
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

// Delete entire grocery list
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