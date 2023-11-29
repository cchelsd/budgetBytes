// import sql from 'mssql';

// const server ="budget-bytes.database.windows.net"
// const database="budgetbytesdb"
// const port = 1433
// const user = "groupMember"
// const password = "groupPassword4"


// export const config = {
//     server,
//     port,
//     database,
//     user,
//     password,
//     options: {
//         encrypt: true
//     }
// };


// console.log("Starting...");
// connectAndQuery();

// async function connectAndQuery() {
//     try {
//         var poolConnection = await sql.connect(config);

//         console.log("Reading rows from the Table...");
//         const resultSet = await poolConnection.request().query(`
//         SELECT TOP 20 
//           [userLogID],
//           [isVegan],
//           [isVegetarian],
//           [isDairyFree],
//           [isLowCarb],
//           [isPescetarian]
//         FROM [dbo].[BudgetBytesTable]
//       `);

//         console.log(`${resultSet.recordset.length} rows returned.`);

//         // Output column headers (hardcoded based on your table structure)
//         console.log("userLogID, isVegan, isVegetarian, isDairyFree, isLowCarb, isPescetarian");

//         // Output row contents
//         resultSet.recordset.forEach(row => {
//             console.log(`${row.userLogID}\t${row.isVegan}\t${row.isVegetarian}\t${row.isDairyFree}\t${row.isLowCarb}\t${row.isPescetarian}`);
//         });

//         // Close the connection
//         poolConnection.close();
//     } catch (err) {
//         console.error(err.message);
//     }
// }