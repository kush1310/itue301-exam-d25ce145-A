/**
 * Authentication Routes
 *
 * Defines endpoints for customer authentication and registration.
 * Route prefix: /api/v1/auth
 */

const express = require('express');
const router = express.Router();
const { loginCustomer, registerCustomer, getCurrentCustomerProfile } = require('../controllers/authController');
const authGuard = require('../middleware/authGuard');

// Public authentication routes
router.post('/login', loginCustomer);
router.post('/register', registerCustomer);

// Protected customer profile route
router.get('/profile', authGuard, getCurrentCustomerProfile);

module.exports = router;
