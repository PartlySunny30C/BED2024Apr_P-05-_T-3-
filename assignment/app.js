const express = require("express");
const path = require("path");
const db = require('./db');
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const dbConfig = require("./dbconfig");
const orderRoutes = require("./routes/orderRoutes");
const orderController = require("./controllers/orderController");
const employeeController = require("./controllers/employeeController");
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

const config = {
    user: 'Perseus',
    password: '42656c6c',
    server: 'localhost', 
    database: 'BedAssignment', 
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/api", orderRoutes);

app.get("/orders", orderController.getAllOrders);
app.get("/orders/:id", orderController.getOrderById);
app.put("/orders/:id", orderController.updateOrderStatus);
app.delete("/orders/:id", orderController.deleteOrder);
app.post("/createorders", orderController.createOrder);

app.get('/employees', employeeController.getAllEmployees); 
app.get('/employees/:id', employeeController.getEmployeesById); 
app.get('/employees/:name', employeeController.getEmployeesByName); 
app.put('/employees/:id', employeeController.updateemployee);

// User Routes
app.get('/Users', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/Users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const pool = await poolPromise;
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
            res.status(500).send('Error creating user');
        }
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});

app.post('/Users/login', async (req, res) => {
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

app.post('/Users/change-password', async (req, res) => {
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
// Financial Records Routes
app.post('/financial-records', async (req, res) => {
    const { recordDate, amount, branch } = req.body;
    let transaction;
    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);
        await transaction.begin();
        try {
            const request = new sql.Request(transaction);
            await request
                .input('recordDate', sql.Date, recordDate)
                .input('amount', sql.Decimal(10, 2), amount)
                .input('branch', sql.VarChar, branch)
                .query('INSERT INTO FinancialRecords (RecordDate, Amount, Branch) VALUES (@recordDate, @amount, @branch)');
            await transaction.commit();
            res.status(201).send('Financial record inserted');
        } catch (error) {
            if (transaction) await transaction.rollback();
            res.status(500).send('Error inserting financial record');
        }
    } catch (error) {
        res.status(500).send('Error inserting financial record');
    }
});

app.get('/financial-records', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM FinancialRecords');
        console.log('Query result:', result); // Debug log
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Server Error');
    }
});

app.delete('/financial-records', async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request().query('DROP TABLE FinancialRecords');
        res.status(200).send('FinancialRecords table dropped');
    } catch (error) {
        res.status(500).send('Error dropping table');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Failed to logout');
            }
            res.redirect('index.html');
        });
    } else {
        res.redirect('index.html');
    }
});

// SQL Server Configuration
const poolPromise = sql.connect(dbConfig)
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

// Server Setup
app.listen(port, async () => {
    try {
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
    console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
});
app.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT 1 AS test');
        res.json(result.recordset);
    } catch (err) {
        console.error('Test connection failed:', err);
        res.status(500).send('Connection Test Failed');
    }
});