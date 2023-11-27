import sql from 'mssql';

export default class Database {
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

  async createUser(data) {
    await this.connect();
    const request = this.poolconnection.request();

    request.input('userLogID', sql.VarChar(4), data.userLogID);
    request.input('isVegan', sql.VarChar(5), data.isVegan);
    request.input('isVegetarian', sql.VarChar(5), data.isVegetarian);
    request.input('isDairyFree', sql.VarChar(5), data.isDairyFree);
    request.input('isLowCarb', sql.VarChar(5), data.isLowCarb);
    request.input('isPescetarian', sql.VarChar(5), data.isPescetarian);

    const result = await request.query(
      `INSERT INTO BudgetBytesTable (userLogID, isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian) VALUES (@userLogID, @isVegan, @isVegetarian, @isDairyFree, @isLowCarb, @isPescetarian)`
    );

    return result.rowsAffected[0];
  }

  async readAll() {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT * FROM BudgetBytesTable`);

    return result.recordsets[0];
  }


  async readUser(userLogID) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request
      .input('userLogID', sql.VarChar(4), userLogID)
      .query(`SELECT * FROM BudgetBytesTable WHERE userLogID = @userLogID`);

    return result.recordset[0];
  }

  async updateUser(userLogID, data) {
    await this.connect();
    const request = this.poolconnection.request();

    request.input('userLogID', sql.VarChar(4), userLogID);
    request.input('isVegan', sql.VarChar(5), data.isVegan);
    request.input('isVegetarian', sql.VarChar(5), data.isVegetarian);
    request.input('isDairyFree', sql.VarChar(5), data.isDairyFree);
    request.input('isLowCarb', sql.VarChar(5), data.isLowCarb);
    request.input('isPescetarian', sql.VarChar(5), data.isPescetarian);

    const result = await request.query(
      `UPDATE BudgetBytesTable SET isVegan=@isVegan, isVegetarian=@isVegetarian, isDairyFree=@isDairyFree, isLowCarb=@isLowCarb, isPescetarian=@isPescetarian WHERE userLogID = @userLogID`
    );

    return result.rowsAffected[0];
  }

  async deleteUser(userLogID) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request
      .input('userLogID', sql.VarChar(4), userLogID)
      .query(`DELETE FROM BudgetBytesTable WHERE userLogID = @userLogID`);

    return result.rowsAffected[0];
  }
}
