require('dotenv').config();

const serviceUrls = {
  userService: process.env.USER_SERVICE_URL || 'http://localhost:5001',
  recipeService: process.env.RECIPE_SERVICE_URL || 'http://localhost:5002',
  orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
  notificationService: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5004'
};

const rateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
};

module.exports = { serviceUrls, rateLimitConfig };
