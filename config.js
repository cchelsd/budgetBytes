const sql = require('mssql');

const config = {
    user: 'TestUser', 
    password: 'Testing123', 
    server: 'budget-bytes.database.windows.net', 
    port: 1433,
    database: 'budgetbytesdb',
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

async function connectToDatabase() {
    try {
        const dbConnection = await sql.connect(config);
        console.log('Connected to the database');
        return dbConnection;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        return err;
    }
}

connectToDatabase();

module.exports = { connectToDatabase };