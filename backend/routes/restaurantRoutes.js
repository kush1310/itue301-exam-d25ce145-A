/**
 * Restaurant Routes
 *
 * Defines endpoints for restaurant catalog retrieval and administrative addition.
 * Route prefix: /api/v1/restaurants
 */

const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant
} = require('../controllers/restaurantController');
const authGuard = require('../middleware/authGuard');

// Public endpoints
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Protected administrative creation endpoint
router.post('/', authGuard, createRestaurant);

module.exports = router;
