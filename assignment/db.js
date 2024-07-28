// db.js
const sql = require('mssql');

const config = {
    user: 'Perseus',
    password: '42656c6c',
    server: 'localhost', 
    database: 'BedAssignment', 
    options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: true // Change to false if not using self-signed certs
    }
};

sql.connect(config, (err) => {
    if (err) {
        console.error('Database connection error:', err);
        throw err;
    }
    console.log('Connected to the database');
});

module.exports = sql;
