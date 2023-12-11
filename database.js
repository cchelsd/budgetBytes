import sql from 'mssql';

class Database {
  config = {};
  poolConnection = null;
  connected = false;

  constructor(config) {
    this.config = config;
    console.log(`Database: config: ${JSON.stringify(config)}`);
  }

  async connect() {
    try {
      console.log(`Database connecting...${this.connected}`);
      if (!this.connected) {
        this.poolConnection = await sql.connect(this.config);
        this.connected = true;
        console.log('Database connection successful');
      } else {
        console.log('Database already connected');
      }
    } catch (error) {
      console.error(`Error connecting to database: ${JSON.stringify(error)}`);
    }
  }

  async disconnect() {
    try {
      if (this.poolConnection) {
        this.poolConnection.close();
        this.connected = false;
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }

  async createUser(user) {
    await this.connect();
    const { userLogID, isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian } = user;
    const request = this.poolConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .input('isVegan', sql.VarChar, isVegan)
      .input('isVegetarian', sql.VarChar, isVegetarian)
      .input('isDairyFree', sql.VarChar, isDairyFree)
      .input('isLowCarb', sql.VarChar, isLowCarb)
      .input('isPescetarian', sql.VarChar, isPescetarian)
      .query('INSERT INTO BudgetBytesTable (userLogID, isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian) VALUES (@userLogID, @isVegan, @isVegetarian, @isDairyFree, @isLowCarb, @isPescetarian)');
  }

  async readAll() {
    await this.connect();
    const request = this.poolConnection.request();
    return request.query('SELECT * FROM BudgetBytesTable');
  }

  async readUser(userLogID) {
    await this.connect();
    const request = this.poolConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .query('SELECT * FROM BudgetBytesTable WHERE userLogID = @userLogID');
  }

  async updateUser(userLogID, updatedUser) {
    await this.connect();
    const { isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian } = updatedUser;
    const request = this.poolConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .input('isVegan', sql.VarChar, isVegan)
      .input('isVegetarian', sql.VarChar, isVegetarian)
      .input('isDairyFree', sql.VarChar, isDairyFree)
      .input('isLowCarb', sql.VarChar, isLowCarb)
      .input('isPescetarian', sql.VarChar, isPescetarian)
      .query('UPDATE BudgetBytesTable SET isVegan = @isVegan, isVegetarian = @isVegetarian, isDairyFree = @isDairyFree, isLowCarb = @isLowCarb, isPescetarian = @isPescetarian WHERE userLogID = @userLogID');
  }

  async deleteUser(userLogID) {
    await this.connect();
    const request = this.poolConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .query('DELETE FROM BudgetBytesTable WHERE userLogID = @userLogID');
  }

  async addToGroceryList(userLogID, theListItem) {
    await this.connect();
    console.log("got to add to list");
    const {itemName, itemQuantity} = theListItem;
    const request = this.poolConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .input('itemName', sql.VarChar, itemName)
      .input('itemQuantity', sql.VarChar, itemQuantity)
      .query('INSERT INTO [budgetbytesdb].[dbo].[GroceryLists] (userLogID, itemName, itemQuantity) VALUES (@userLogID, @itemName, @itemQuantity)');
  }

  async readAllLists() {
    await this.connect();
    const request = this.poolConnection.request();
    return request.query('SELECT * FROM GroceryLists');
  }

  async readGroceryList(userLogID) {
    await this.connect();
    const request = this.poolConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .query('SELECT itemName, itemQuantity FROM GroceryLists WHERE userLogID = @userLogID'); //make sure all are selected !!
  }

  //update itemquantity in user's grocery list
  async updateItem(userLogID, updatedItem) {
    await this.connect();
    const {itemName, itemQuantity} = updatedItem;
    const request = this.poolConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .input('itemName', sql.VarChar, itemName)
      .input('itemQuantity', sql.VarChar, itemQuantity)
      .query('UPDATE GroceryLists SET userLogID = @userLogID, itemName = @itemName, itemQuantity = @itemQuantity WHERE (userLogID = @userLogID) AND (itemName = @itemName)');
  }

  //delete specific item in user's grocery list
  //double check 
  async deleteGroceryListItem(userLogID, itemName) {
    await this.connect();
    const request = this.poolConnection.request();
    console.log("got to database delete");
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .input('itemName', sql.VarChar, itemName)
      .query('DELETE FROM [budgetbytesdb].[dbo].[GroceryLists] WHERE userLogID = @userLogID AND itemName = @itemName');
  }

  //delete entire list
  async deleteGroceryList(userLogID) {
    await this.connect();
    const request = this.poolConnection.request();
    return request
      .input('userLogID', sql.VarChar, userLogID)
      .query('DELETE FROM [budgetbytesdb].[dbo].[GroceryLists] WHERE userLogID = @userLogID');
  }
}

export default Database;