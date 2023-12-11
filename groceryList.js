import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import Database from './database.js';

const router = express.Router();
router.use(cors());
router.use(express.json());


const database = new Database(config);

// Get all users' grocery lists
router.get('/getLists', async (_, res) => {
  try {
    // Return all users' grocery lists
    const lists = await database.readAllLists();
    console.log(`All Grocery Lists: ${JSON.stringify(lists)}`);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

// Add item to user's grocery list
router.post('/:userLogID', async (req, res) => {
  try {
    const userLogID = req.params.userLogID;
    const list = req.body;
    console.log(`adding item to grocery list: ${JSON.stringify(list)}`);
    const rowsAffected = await database.addToGroceryList(userLogID, list);
    res.status(201).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

// Get grocery list by userLogID
router.get('/:userLogID', async (req, res) => { 
  try {
    const userLogID = req.params.userLogID;
    console.log(`Fetching user's grocery list: ${userLogID}`);
    const user = await database.readGroceryList(userLogID);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User\'s grocery list not found' });
    }
  } catch (err) {
    console.log("got to get's error");
    res.status(500).json({ error: err?.message });
  }
});

// Update quantity of an item
router.put('/:userLogID', async (req, res) => {
  try {
    const userLogID = req.params.userLogID;
    const updatedItem = req.body;
    console.log(`Updating user: ${userLogID}, New Item Info: ${JSON.stringify(updatedItem)}`);
    const rowsAffected = await database.updateItem(userLogID, updatedItem);
    res.status(200).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

// Remove item from user's grocery list
router.delete('/:userLogID/:itemName', async (req, res) => {
  try {
    const userLogID = req.params.userLogID;
    const itemToDelete = req.params.itemName;
    console.log(`Deleting item:${JSON.stringify(itemToDelete)}, From user's list: ${userLogID}`);
    const rowsAffected = await database.deleteGroceryListItem(userLogID, itemToDelete);
    console.log("rows affected: " + JSON.stringify(rowsAffected));
    res.status(204).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

// Delete entire grocery list
router.delete('/:userLogID', async (req, res) => {
    try {
      const userLogID = req.params.userLogID;
      console.log(`Deleting user's grocery list: ${userLogID}`);
      const rowsAffected = await database.deleteGroceryList(userLogID);
      res.status(204).json({ rowsAffected });
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
});

export default router;