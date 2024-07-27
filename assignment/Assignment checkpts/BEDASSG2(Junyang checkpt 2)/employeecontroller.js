const employee = require("./employee.js");

const getallemployees  = async (req, res) => {
  try {
    const employees = await employee.getallemployees();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving employees");
  }
};

const getemployeebyid = async (req, res) => {
  const employeeId = parseInt(req.params.id);
  try {
    const Employee = await employee.getemployeebyid(employeeId);
    if (!Employee) {
      return res.status(404).send("Book not found");
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
    getallemployees,
    getemployeebyid,
    updateemployee,
  };