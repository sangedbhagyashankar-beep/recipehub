const express = require('express');
const { placeOrder, getUserOrders, getAllOrders, getOrder, updateOrderStatus } = require('../controller/orderController');

const router = express.Router();

router.post('/', placeOrder);
router.get('/my', getUserOrders);
router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
