const express = require("express");
const router = express.Router();
const orderController = require('../controllers/orderController');
const validateOrder = require("../middlewares/validateOrder");

router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id", validateOrder, orderController.updateOrderStatus);
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;