const dbConfig = {
  user: 'Perseus',
  password: '42656c6c',
  server: 'localhost', 
  database: 'BedAssignment', 
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: 1433, 
  connectionTimeout: 60000, 
};

module.exports = dbConfig;
