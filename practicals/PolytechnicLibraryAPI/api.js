const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const config = {
  user: 'Perseus',
  password: '42656c6c',
  server: 'localhost',
  database: 'BedAssignment',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const poolPromise = sql.connect(config)
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

// User Registration Endpoint
app.post('/users/register', async (req, res) => {
  const { name, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO Users (name, password) VALUES (@name, @password)');
    res.status(201).send('User created');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});

// Login Endpoint
app.post('/users/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .query('SELECT TOP 1 * FROM Users WHERE name = @name');
    const user = result.recordset[0];
    if (!user) {
      return res.status(400).send('Cannot find user');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }
    const payload = { id: user.user_id, name: user.name };
    const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' }); // Expires in 1 hour
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Login error');
  }
});

// Change Password Endpoint
app.post('/users/change-password', async (req, res) => {
  const { name, password, newPassword } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .query('SELECT TOP 1 * FROM Users WHERE name = @name');
    const user = result.recordset[0];
    if (!user) {
      return res.status(400).send('Cannot find user');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input('name', sql.VarChar, name)
      .input('password', sql.VarChar, hashedPassword)
      .query('UPDATE Users SET password = @password WHERE name = @name');
    res.send('Password updated');
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send('Error changing password');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
