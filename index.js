import express from 'express';
import { config } from './config.js';
import Database from './database.js';
// const express = require("express")
const cors = require("cors")
// retrieve the MySQL DB Configuration Module
// use this library for parsing HTTP body requests
var bodyParser = require('body-parser');

// Import App routes
import user from './user.js';

const port = process.env.PORT || 3000;

// const app = express();
var app = express(express.json);

// Connect App routes
app.use('/user', user);

app.use(cors());
app.use(bodyParser.json());

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
