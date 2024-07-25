const apiUrl = 'http://localhost:3000';
const cors = require('cors'); 
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const app = express();
app.use(cors()); 
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      await pool.request()
        .input('name', sql.VarChar, req.body.name)
        .input('password', sql.VarChar, hashedPassword)
        .query('INSERT INTO Users (name, password) VALUES (@name, @password)');
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
      .input('name', sql.VarChar, req.body.name)
      .query('SELECT TOP 1 * FROM Users WHERE name = @name');

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).send('Cannot find user');
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success');
    } else {
      res.send('Not Allowed');
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
      .input('name', sql.VarChar, req.body.name)
      .query('SELECT TOP 1 * FROM Users WHERE name = @name');

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).send('Cannot find user');
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    await pool
      .request()
      .input('name', sql.VarChar, req.body.name)
      .input('password', sql.VarChar, hashedPassword)
      .query('UPDATE Users SET password = @password WHERE name = @name');
    res.send('Password updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// New endpoint to insert financial records
app.post('/financial-records', async (req, res) => {
  try {
    const { recordDate, month, year, amount } = req.body;
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      await pool.request()
        .input('recordDate', sql.Date, recordDate)
        .input('month', sql.Int, month)
        .input('year', sql.Int, year)
        .input('amount', sql.Decimal(10, 2), amount)
        .query('INSERT INTO FinancialRecords (RecordDate, Month, Year, Amount) VALUES (@recordDate, @month, @year, @amount)');
      await transaction.commit();
      res.status(201).send('Financial record inserted');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error inserting financial record:', error); 
    res.status(500).send('Error inserting financial record'); 
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Function to show messages
function showMessage(message, isSuccess) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerText = message;
  messageDiv.className = isSuccess ? 'message success' : 'message error';
}

// Function to register a user
async function registerUser() {
  const name = document.getElementById('registerName').value;
  const password = document.getElementById('registerPassword').value;

  try {
      const response = await fetch(`${apiUrl}/users`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, password }),
      });

      const message = await response.text();
      if (response.ok) {
          showMessage(`Success: ${message}`, true);
      } else {
          showMessage(`Error: ${message}`, false);
      }
  } catch (error) {
      showMessage(`Error: ${error.message}`, false);
  }
}

// Function to log in a user
async function loginUser() {
  const name = document.getElementById('loginName').value;
  const password = document.getElementById('loginPassword').value;

  try {
      const response = await fetch(`${apiUrl}/users/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, password }),
      });

      const message = await response.text();
      if (response.ok) {
          showMessage(`Success: ${message}`, true);
      } else {
          showMessage(`Error: ${message}`, false);
      }
  } catch (error) {
      showMessage(`Error: ${error.message}`, false);
  }
}

// Function to change a user's password
async function changePassword() {
  const name = document.getElementById('changePasswordName').value;
  const newPassword = document.getElementById('newPassword').value;

  try {
      const response = await fetch(`${apiUrl}/users/change-password`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, newPassword }),
      });

      const message = await response.text();
      if (response.ok) {
          showMessage(`Connection Success: ${message}`, true);
      } else {
          showMessage(`Connection Error: ${message}`, false);
      }
  } catch (error) {
      showMessage(`Error: ${error.message}`, false);
  }
}
