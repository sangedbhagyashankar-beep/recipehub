const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { serviceUrls } = require('../config/gatewayConfig');

const router = express.Router();

// Auth middleware to forward JWT token
const forwardAuth = (proxyReq, req) => {
  if (req.headers.authorization) {
    proxyReq.setHeader('Authorization', req.headers.authorization);
  }
};

const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  on: { proxyReq: forwardAuth },
  logLevel: 'warn'
});

// Route: /api/users/* -> User Service
router.use('/users', createProxyMiddleware(proxyOptions(serviceUrls.userService)));

// Route: /api/recipes/* -> Recipe Service
router.use('/recipes', createProxyMiddleware(proxyOptions(serviceUrls.recipeService)));

// Route: /api/orders/* -> Order Service
router.use('/orders', createProxyMiddleware(proxyOptions(serviceUrls.orderService)));

// Route: /api/notifications/* -> Notification Service
router.use('/notifications', createProxyMiddleware(proxyOptions(serviceUrls.notificationService)));

module.exports = router;
