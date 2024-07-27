const employee = require("../models/employee.js");

const getAllEmployees  = async (req, res) => {
  try {
    const employees = await employee.getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving employees");
  }
};

const getEmployeesById= async (req, res) => {
  const employeeId = parseInt(req.params.id);
  try {
    const Employee = await employee.getEmployeesById(employeeId);
    if (!Employee) {
      return res.status(404).send("Employee not found");
    }
    res.json(Employee);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving employee");
  }
};

const getEmployeesByName= async (req, res) => {
  const employeeName = parseInt(req.params.name);
  try {
    const Employee = await employee.getEmployeesByName(employeeName);
    if (!Employee) {
      return res.status(404).send("Employee not found");
    }
    res.json(Employee);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving employee");
  }
};

const updateemployee = async (req, res) => {
    const employeeId = parseInt(req.params.id);
    const updatedemployeedata = req.body;
  
    try {
      const updatedemployee = await employee.updateemployee(employeeId, updatedemployeedata);
      if (!updatedemployee) {
        return res.status(404).send("employee not found");
      }
      res.json(updatedemployee);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating employee");
    }
  };


module.exports = {
    getAllEmployees,
    getEmployeesById,
    updateemployee,
    getEmployeesByName
  };