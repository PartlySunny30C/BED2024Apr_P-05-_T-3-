  const sql = require("mssql");
  const dbConfig = require("../dbconfig");

  class Order {
    constructor(order_id, manager, status, branch_number, items) {
      this.order_id = order_id;
      this.manager = manager;
      this.status = status;
      this.branch_number = branch_number;
      this.items = items;
      
    } 

    static async getAllOrders() {
      try {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Orders`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(row => {
          return new Order(row.order_id, row.manager, row.status, row.branch_number, row.items);
      });
        
      } catch (err) {
        console.error('Error fetching orders:', err);
        throw err;
      }
    }    
          
    static async getOrderById(id) {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `SELECT * FROM orders WHERE order_id = @id`;

      const request = connection.request();
      request.input("id", id);
      const result = await request.query(sqlQuery);

      connection.close();

      return result.recordset[0]
        ? new Order(
            result.recordset[0].order_id,
            result.recordset[0].manager,
            result.recordset[0].status,
            result.recordset[0].branch_number,
            result.recordset[0].items,
          )
        : null;
    }

    static async createOrder(newOrder) {
        const connection = await sql.connect(dbConfig);

        const itemsJson = JSON.stringify(newOrder.items);

    
        const sqlQuery =`INSERT INTO orders (manager, branch_number, status, items)
                VALUES (@manager, @branch_number, @status, @items);
                SELECT SCOPE_IDENTITY() AS id;` ;
    
        const request = connection.request();
        request.input("id", newOrder.id);
        request.input("manager", newOrder.manager);
        request.input("status", "Pending");
        request.input("branch_number", newOrder.branch_number);
        request.input("items", sql.NVarChar(sql.MAX), itemsJson);
        
    
        const result = await request.query(sqlQuery);
    
        connection.close();

        return this.getOrderById(result.recordset[0].id);

    
      }

    static async updateOrderStatus(id, newOrderData) {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `UPDATE orders SET status = @status WHERE order_id = @id`;

      const request = connection.request();
      request.input("id", id);
      request.input("status", newOrderData.status || null);
      await request.query(sqlQuery);

      connection.close();

      return this.getOrderById(id);
    }

    static async deleteOrder(id) {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `DELETE FROM orders WHERE order_id = @id`;

      const request = connection.request();
      request.input("id", id);
      const result = await request.query(sqlQuery);

      connection.close();

      return result.rowsAffected > 0;
    }
  }

  module.exports = Order;
