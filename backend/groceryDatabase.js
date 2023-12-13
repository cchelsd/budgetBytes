const sql = require('mssql');
const dbConnection = require('./config');

async function addToGroceryList(userLogID, theListItem) {
    console.log("got to add to list");
    const {itemName, itemQuantity} = theListItem;
    const request = dbConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .input('itemName', sql.VarChar, itemName)
      .input('itemQuantity', sql.VarChar, itemQuantity)
      .query('INSERT INTO [budgetbytesdb].[dbo].[GroceryLists] (userLogID, itemName, itemQuantity) VALUES (@userLogID, @itemName, @itemQuantity)');
  }

async function readAllLists() {
    const request = dbConnection.request();
    return request.query('SELECT * FROM GroceryLists');
}

async function readGroceryList(userLogID) {
    const request = dbConnection.request();
    return request
        .input('userLogID', sql.VarChar, userLogID)
        .query('SELECT itemName, itemQuantity FROM GroceryLists WHERE userLogID = @userLogID'); //make sure all are selected !!
}

//update itemquantity in user's grocery list
async function updateItem(userLogID, updatedItem) {
    const {itemName, itemQuantity} = updatedItem;
    const request = dbConnection.request();
    return request
        .input('userLogID', sql.VarChar, userLogID)
        .input('itemName', sql.VarChar, itemName)
        .input('itemQuantity', sql.VarChar, itemQuantity)
        .query('UPDATE GroceryLists SET userLogID = @userLogID, itemName = @itemName, itemQuantity = @itemQuantity WHERE (userLogID = @userLogID) AND (itemName = @itemName)');
}

//delete specific item in user's grocery list
//double check 
async function deleteGroceryListItem(userLogID, itemName) {
    const request = dbConnection.request();
    return request
        .input('userLogID', sql.VarChar, userLogID)
        .input('itemName', sql.VarChar, itemName)
        .query('DELETE FROM [budgetbytesdb].[dbo].[GroceryLists] WHERE userLogID = '+ userLogID + 'AND itemName = ' + itemName);
}

  //delete user's entire grocery list
async function deleteGroceryList(userLogID) {
    const request = dbConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .query('DELETE FROM [budgetbytesdb].[dbo].[GroceryLists] WHERE userLogID = @userLogID');
}

module.exports = {
    addToGroceryList,
    readAllLists,
    readGroceryList,
    updateItem,
    deleteGroceryListItem,
    deleteGroceryList
}
