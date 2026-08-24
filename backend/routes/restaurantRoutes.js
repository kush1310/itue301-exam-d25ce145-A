/**
 * Restaurant Routes
 *
 * Defines endpoints for restaurant catalog retrieval, canteen controls,
 * and menu management.
 * Route prefix: /api/v1/restaurants
 */

const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  toggleRestaurantStatus,
  addMenuItem,
  removeMenuItem,
  createRestaurant
} = require('../controllers/restaurantController');
const authGuard = require('../middleware/authGuard');
const adminGuard = require('../middleware/adminGuard');

// Public catalog endpoints
router.get('/', getAllRestaurants);

// Protected Restaurant Owner / Admin endpoints
router.get('/my-restaurant', authGuard, adminGuard, getMyRestaurant);
router.patch('/:id/toggle-status', authGuard, adminGuard, toggleRestaurantStatus);
router.post('/:id/menu', authGuard, adminGuard, addMenuItem);
router.delete('/:id/menu/:itemId', authGuard, adminGuard, removeMenuItem);

// Public single restaurant query
router.get('/:id', getRestaurantById);

// Protected administrative creation endpoint
router.post('/', authGuard, adminGuard, createRestaurant);

module.exports = router;
