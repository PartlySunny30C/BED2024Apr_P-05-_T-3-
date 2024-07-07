  const sql = require("mssql");
  const dbConfig = require("../dbConfig");

  class Order {
    constructor(order_id, manager, status, branch_number, items, item_quantity) {
      this.order_id = order_id;
      this.manager = manager;
      this.status = status;
      this.branch_number = branch_number;
      this.items = items;
      this.item_quantity = item_quantity;
    } 

    static async getAllOrders() {
      try {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT order_id, manager, status, branch_number, items, item_quantity FROM orders`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
    
        return result.recordset.map(row => {
          const itemsArray = row.items.split(', ');
          const itemQuantityArray = row.item_quantity.split(', ').map(Number);
          
          const itemsWithQuantities = itemsArray.map((item, index) => ({
            item: item.trim(),
            quantity: itemQuantityArray[index]
          }));
    
          return new Order(
            row.order_id,
            row.manager,
            row.status,
            row.branch_number,
            itemsWithQuantities 
          );
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
            result.recordset[0].item_quantity
          )
        : null;
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
