const Order = require("../models/order");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving orders");
  }
};

const getOrderById = async (req, res) => {
  const orderId = parseInt(req.params.id);
  try {
    const order = await Order.getOrderById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving order");
  }
};

const createOrder = async (req, res) => {
    const newOrder = req.body;
    try {
      const createdorder = await Order.createOrder(newOrder);
      res.status(201).json(createdorder);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating order");
    }
  };

const updateOrderStatus = async (req, res) => {
  const orderId = parseInt(req.params.id);
  const newOrderData = req.body;

  try {
    const updatedOrder = await Order.updateOrderStatus(orderId, newOrderData);
    if (!updatedOrder) {
      return res.status(404).send("Order not found");
    }
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating order");
  }
};

const deleteOrder = async (req, res) => {
  const orderId = parseInt(req.params.id);

  try {
    const success = await Order.deleteOrder(orderId);
    if (!success) {
      return res.status(404).send("Order not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting order");
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};