const express = require('express');
const employeeController = require('./employeecontroller.js'); 
const bodyParser = require("body-parser");
const app = express();
const port = 3017;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/employees', employeeController.getallemployees); 
app.get('/employees/:id', employeeController.getemployeebyid); 
app.put('/employees/:id', employeeController.updateemployee);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
