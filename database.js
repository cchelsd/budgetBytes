import sql from 'mssql';

class Database {
  config = {};
  poolconnection = null;
  connected = false;

  constructor(config) {
    this.config = config;
    console.log(`Database: config: ${JSON.stringify(config)}`);
  }

  async connect() {
    try {
      console.log(`Database connecting...${this.connected}`);
      if (this.connected === false) {
        this.poolconnection = await sql.connect(this.config);
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
      this.poolconnection.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }

  async executeQuery(query) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(query);

    return result.rowsAffected[0];
  }

  async createUser(user) {
    const pool = await this.connectionPool;
    const { userLogID, isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian } = user;
    return pool.request()
      .input('userLogID', sql.VarChar, userLogID)
      .input('isVegan', sql.VarChar, isVegan)
      .input('isVegetarian', sql.VarChar, isVegetarian)
      .input('isDairyFree', sql.VarChar, isDairyFree)
      .input('isLowCarb', sql.VarChar, isLowCarb)
      .input('isPescetarian', sql.VarChar, isPescetarian)
      .query('INSERT INTO BudgetBytesTable (userLogID, isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian) VALUES (@userLogID, @isVegan, @isVegetarian, @isDairyFree, @isLowCarb, @isPescetarian)');
  }


 async readAll() {
    const pool = await this.connectionPool;
    return pool.request().query('SELECT * FROM BudgetBytesTable');
  }


 async readUser(userLogID) {
    const pool = await this.connectionPool;
    return pool.request()
      .input('userLogID', sql.VarChar, userLogID)
      .query('SELECT * FROM BudgetBytesTable WHERE userLogID = @userLogID');
  }


 async updateUser(userLogID, updatedUser) {
    const pool = await this.connectionPool;
    const { isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian } = updatedUser;
    return pool.request()
      .input('userLogID', sql.VarChar, userLogID)
      .input('isVegan', sql.VarChar, isVegan)
      .input('isVegetarian', sql.VarChar, isVegetarian)
      .input('isDairyFree', sql.VarChar, isDairyFree)
      .input('isLowCarb', sql.VarChar, isLowCarb)
      .input('isPescetarian', sql.VarChar, isPescetarian)
      .query('UPDATE BudgetBytesTable SET isVegan = @isVegan, isVegetarian = @isVegetarian, isDairyFree = @isDairyFree, isLowCarb = @isLowCarb, isPescetarian = @isPescetarian WHERE userLogID = @userLogID');
  }

  async deleteUser(userLogID) {
    const pool = await this.connectionPool;
    return pool.request()
      .input('userLogID', sql.VarChar, userLogID)
      .query('DELETE FROM BudgetBytesTable WHERE userLogID = @userLogID');
  }
}

export default Database;