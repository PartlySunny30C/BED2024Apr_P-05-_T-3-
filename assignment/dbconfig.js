const dbConfig = {
  user: 'Perseus',
  password: '42656c6c',
  server: 'localhost', // or 'localhost\\SQLEXPRESS' if using a named instance
  database: 'BedAssignment', 
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: 1433, // Default SQL Server port
  connectionTimeout: 60000, // Connection timeout in milliseconds
};

module.exports = dbConfig;
