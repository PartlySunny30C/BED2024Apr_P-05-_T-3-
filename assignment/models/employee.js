const sql = require("mssql");
const dbConfig = require("../dbconfig");


class employee{
  constructor(id, name , contactNumber , role , datejoin) {
        this.id = id;
        this.name = name;
        this.contactNumber = contactNumber;
        this.role=role;
        this.datejoin= datejoin;
    };

    static async getAllEmployees() {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `SELECT * FROM Employees`; // Replace with your actual table name
  
      const request = connection.request();
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.recordset.map(
        (row) => new employee(row.id, row.name ,row.role , row.contactNumber , row.datejoin)
      ); 
    }

  static async getEmployeesById(EmployeeId) {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `SELECT * FROM Employees WHERE id = @id`; // Parameterized query
  
      const request = connection.request();
      request.input("id", EmployeeId);
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.recordset[0]
        ? new employee(
            result.recordset[0].id,
            result.recordset[0].name,
            result.recordset[0].role,
            result.recordset[0].contactNumber,
            result.recordset[0].datejoin
            
          )
        : null; 
    }


    static async getEmployeesByName(EmployeeName) {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `SELECT * FROM Employees WHERE name = @name`; // Parameterized query
  
      const request = connection.request();
      request.input("name", EmployeeName);
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.recordset[0]
        ? new employee(
            result.recordset[0].id,
            result.recordset[0].name,
            
            
          )
        : null; 
    }


  static async updateemployee(id, updatedemployeedata) {
    const employees = await this.getallemployees(); 
    const existingEmployeeIndex = employees.findIndex((employee) => employee.id === id);
    if (existingEmployeeIndex=== -1) {
      return null; 
    }

    const updatedemployee= {
      ...employees[existingEmployeeIndex],
      ...updatedemployeedata,
    };

    employees[existingEmployeeIndex] = updatedemployee;
    return updatedemployee;
  };

  

}


module.exports = employee;