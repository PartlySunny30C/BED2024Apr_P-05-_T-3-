const express = require("express");
const orderController = require("./controllers/orderController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const validateOrder = require("./middlewares/validateOrder");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();

const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(staticMiddleware);

app.use("/api", orderRoutes);

app.get("/orders", orderController.getAllOrders);
app.get("/orders/:id", orderController.getOrderById);
app.put("/orders/:id", validateOrder, orderController.updateOrderStatus);
app.delete("/orders/:id", orderController.deleteOrder);

app.use(router);

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