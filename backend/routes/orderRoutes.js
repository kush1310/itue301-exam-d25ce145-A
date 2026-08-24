/**
 * Order Routes
 *
 * Defines endpoints for placing orders, retrieving populated customer orders,
 * and modifying order statuses.
 * Route prefix: /api/v1/orders
 */

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const authGuard = require('../middleware/authGuard');

// All order endpoints are protected by authGuard middleware
router.post('/', authGuard, createOrder);
router.get('/', authGuard, getCustomerOrders);
router.patch('/:id/status', authGuard, updateOrderStatus);

module.exports = router;
