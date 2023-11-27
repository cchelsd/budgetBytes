// import * as dotenv from 'dotenv';
// dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

// const server = process.env.AZURE_SQL_SERVER;
// const database = process.env.AZURE_SQL_DATABASE;
// const port = parseInt(process.env.AZURE_SQL_PORT);
// const user = process.env.AZURE_SQL_USER;
// const password = process.env.AZURE_SQL_PASSWORD;

const server ="budget-bytes.database.windows.net"
const database="BudgetBytesTable"
const port = 1433
const user = "groupMember"
const password = "groupPassword4"


export const config = {
    server,
    port,
    database,
    user,
    password,
    options: {
        encrypt: true
    }
};