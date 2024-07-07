const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const validator = require('./validation'); 


const app = express();
app.use(express.json());

const config = {
  user: 'sa',
  password: '123',
  server: 'localhost',
  database: 'new2', 
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


const authPage = (permissions) => {
    return async (req, res, next) => {
      try {
        const pool = await poolPromise;
        const result = await pool
          .request()
          .input('username', sql.VarChar, req.body.username)
          .query('SELECT TOP 1 * FROM Users WHERE username = @username');
  
        const user = result.recordset[0];
        if (!user) {
          return res.status(400).send('Cannot find user');
        }
  
        if (!await bcrypt.compare(req.body.passwordHash, user.passwordHash)) {
          return res.status(403).send('Invalid password');
        }
  
        if (!permissions.includes(user.role)) {
          return res.status(401).json("You don't have permission to access this page");
        }
  
        next();
      } catch (err) {
        res.status(500).send(err.message);
      }
    };
  };


app.get('/books', authPage(["member" , "librarian"]) ,async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Books');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/users', async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM Users');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });



app.post('/users', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.passwordHash, 10);
      const pool = await poolPromise;
  
      // Randomly assign a role: "librarian" or "user"
      const roles = ['librarian', 'member'];
      const assignedRole = roles[Math.floor(Math.random() * roles.length)];
  
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
  
      try {
        await transaction.request()
          .input('username', sql.VarChar, req.body.username)
          .input('passwordHash', sql.VarChar, hashedPassword)
          .input('role', sql.VarChar, assignedRole)
          .query('INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role)');
        await transaction.commit();
  
        res.status(201).send('User created');
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('Error creating user');
    }
  });
  

app.post('/users/login', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('username', sql.VarChar, req.body.username)
      .query('SELECT TOP 1 * FROM Users WHERE username = @username');

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).send('Cannot find user');
    }

    if (await bcrypt.compare(req.body.passwordHash, user.passwordHash)) {
      res.send('Success');
    } else {
      res.status(403).send('Not Allowed');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/users/change-password', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('username', sql.VarChar, req.body.username)
      .query('SELECT TOP 1 * FROM Users WHERE username = @username');

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).send('Cannot find user');
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    await pool
      .request()
      .input('username', sql.VarChar, req.body.username)
      .input('password', sql.VarChar, hashedPassword)
      .query('UPDATE Users SET password = @password WHERE username = @username');
    res.send('Password updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/books/:bookId/availability', authPage(['librarian']), validator.validateAvailability, async (req, res) => {
    const bookId = req.params.bookId;
    const { availability } = req.body;
  
    try {
      const pool = await poolPromise;
  
      const result = await pool
        .request()
        .input('bookId', sql.Int, bookId)
        .query('SELECT TOP 1 * FROM Books WHERE book_Id = @bookId');
  
      const book = result.recordset[0];
      if (!book) {
        return res.status(404).send('Book not found');
      }
  
      await pool
        .request()
        .input('bookId', sql.Int, bookId)
        .input('availability', sql.VarChar, availability)
        .query('UPDATE Books SET availability = @availability WHERE book_Id = @bookId');
  
      res.send('Availability updated successfully');
    } catch (err) {
      console.error('Error updating book availability:', err.message);
      res.status(500).send('Internal Server Error');
    }
  });


app.listen(3030, () => {
  console.log('Server is running on http://localhost:3018');
});