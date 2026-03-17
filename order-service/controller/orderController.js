const axios = require('axios');
const Order = require('../models/orderModel');
const jwt = require('jsonwebtoken');

const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch { return null; }
};

const notifyUser = async (userId, message) => {
  try {
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`, {
      userId, message, type: 'order'
    });
  } catch (err) {
    console.error('Notification service error:', err.message);
  }
};

// @desc    Place order
// @route   POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authorized' });

    const { recipeId, recipeTitle, quantity, totalPrice, deliveryAddress, notes } = req.body;
    const order = await Order.create({ userId, recipeId, recipeTitle, quantity, totalPrice, deliveryAddress, notes });

    await notifyUser(userId, `Your order for "${recipeTitle}" has been placed! Order ID: ${order._id}`);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my
exports.getUserOrders = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authorized' });
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await notifyUser(order.userId, `Your order "${order.recipeTitle}" status updated to: ${status}`);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
