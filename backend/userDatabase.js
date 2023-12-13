// import sql from 'mssql';
const sql = require('mssql');
const dbConnection = require('./config');
// class Database {
//   config = {};
//   poolConnection = null;
//   connected = false;
//
//   constructor(config) {
//     this.config = config;
//     console.log(`Database: config: ${JSON.stringify(config)}`);
//   }
//
//   async connect() {
//     try {
//       console.log(`Database connecting...${this.connected}`);
//       if (!this.connected) {
//         this.poolConnection = await sql.connect(this.config);
//         this.connected = true;
//         console.log('Database connection successful');
//       } else {
//         console.log('Database already connected');
//       }
//     } catch (error) {
//       console.error(`Error connecting to database: ${JSON.stringify(error)}`);
//     }
//   }
//
//   async disconnect() {
//     try {
//       if (this.poolConnection) {
//         this.poolConnection.close();
//         this.connected = false;
//         console.log('Database connection closed');
//       }
//     } catch (error) {
//       console.error(`Error closing database connection: ${error}`);
//     }
//   }

async function createUser(user) {
    // await this.connect();
  const { userLogID, isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian } = user;
    const request = dbConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .input('isVegan', sql.VarChar, isVegan)
      .input('isVegetarian', sql.VarChar, isVegetarian)
      .input('isDairyFree', sql.VarChar, isDairyFree)
      .input('isLowCarb', sql.VarChar, isLowCarb)
      .input('isPescetarian', sql.VarChar, isPescetarian)
      .query('INSERT INTO BudgetBytesTable (userLogID, isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian) VALUES (@userLogID, @isVegan, @isVegetarian, @isDairyFree, @isLowCarb, @isPescetarian)');
}

  async function readAll() {
    // await this.connect();
    const request = dbConnection.request();
    return request.query('SELECT * FROM BudgetBytesTable');
  }

  async function readUser(userLogID) {
    // await this.connect();
    const request = dbConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .query('SELECT * FROM BudgetBytesTable WHERE userLogID = @userLogID');
  }

  async function updateUser(userLogID, updatedUser) {
    // await this.connect();
    const { isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian } = updatedUser;
    const request = dbConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .input('isVegan', sql.VarChar, isVegan)
      .input('isVegetarian', sql.VarChar, isVegetarian)
      .input('isDairyFree', sql.VarChar, isDairyFree)
      .input('isLowCarb', sql.VarChar, isLowCarb)
      .input('isPescetarian', sql.VarChar, isPescetarian)
      .query('UPDATE BudgetBytesTable SET isVegan = @isVegan, isVegetarian = @isVegetarian, isDairyFree = @isDairyFree, isLowCarb = @isLowCarb, isPescetarian = @isPescetarian WHERE userLogID = @userLogID');
  }

  async function deleteUser(userLogID) {
    // await this.connect();
    const request = dbConnection.request();
    const query = `
      DELETE FROM BudgetBytesTable WHERE userLogID = @userLogID;
      DELETE FROM favorites WHERE userLogID = @userLogID;
      DELETE FROM savedRecipes WHERE userLogID = @userLogID;
      DELETE FROM recipeHistory WHERE userLogID = @userLogID;
    `;
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .query(query);
  }
// export default Database;
module.exports = {
    createUser,
    readAll,
    readUser,
    updateUser,
    deleteUser
};