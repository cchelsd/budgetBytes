// import express from 'express';
// import { config } from './config.js';
// import Database from '../database.js';

// const router = express.Router();
// router.use(express.json());

// const database = new Database(config);

const express = require("express");
const router = express.Router();
const userData = require('../database');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = req.body;
    console.log(`Creating user: ${JSON.stringify(user)}`);
    const rowsAffected = await userData.createUser(user);
    res.status(201).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});


// Get all users
router.get('/getUsers', async (_, res) => {
    try {
      // Return a list of persons
      const users = await userData.readAll();
      console.log(`Users: ${JSON.stringify(users)}`);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
  });

// Get user by userLogID
router.get('/:userLogID', async (req, res) => {
  try {
    const userLogID = req.params.userLogID;
    console.log(`Fetching user: ${userLogID}`);
    const user = await userData.readUser(userLogID);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

// Update user preferences
router.put('/:userLogID', async (req, res) => {
  try {
    const userLogID = req.params.userLogID;
    const updatedUser = req.body;
    console.log(`Updating user: ${userLogID}, Data: ${JSON.stringify(updatedUser)}`);
    const rowsAffected = await userData.updateUser(userLogID, updatedUser);
    res.status(200).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

// Delete a user
router.delete('/:userLogID', async (req, res) => {
  try {
    const userLogID = req.params.userLogID;
    console.log(`Deleting user: ${userLogID}`);
    const rowsAffected = await userData.deleteUser(userLogID);
    res.status(204).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

module.exports = router;