/**
 * Authentication Controller
 *
 * Handles customer, restaurant owner, and administrator authentication,
 * registration, and JWT token issuance with Role-Based Access Control (RBAC).
 */

const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

/**
 * generateToken Helper
 *
 * Signs a JSON Web Token with customer identifier, authorization role, and restaurantId.
 *
 * @param  {string} id           - Customer MongoDB ObjectId
 * @param  {string} role         - User role ('Customer' | 'Restaurant Owner' | 'Admin')
 * @param  {string} [restaurantId] - Associated restaurant identifier for owners
 * @returns {string}             - Signed JWT Bearer token string
 */
const generateToken = (id, role, restaurantId = null) => {
  const secret = process.env.JWT_SECRET || 'quickbite_super_secure_jwt_secret_key_2026_exam_token';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id, role, restaurantId }, secret, { expiresIn });
};

/**
 * loginCustomer
 *
 * Validates submitted credentials against the database.
 * Enforces role verification when requested (Customer, Restaurant Owner, Admin).
 */
const loginCustomer = async (req, res, next) => {
  try {
    const { email, password, requiredRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          status: 400,
          message: 'Both email and password are required fields.'
        }
      });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase().trim() }).populate('restaurantId');

    if (!customer) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          status: 401,
          message: 'Invalid email address or password.'
        }
      });
    }

    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          status: 401,
          message: 'Invalid email address or password.'
        }
      });
    }

    // Role-based segregation enforcement
    if (requiredRole && customer.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ROLE_MISMATCH',
          status: 403,
          message: `Access Denied: This account has role '${customer.role}' and cannot log in through the '${requiredRole}' portal.`
        }
      });
    }

    const token = generateToken(customer._id, customer.role, customer.restaurantId?._id || customer.restaurantId);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: {
        token: token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          role: customer.role,
          restaurantId: customer.restaurantId
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * registerCustomer
 *
 * Registers a new account and returns a signed JWT.
 */
const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, role, restaurantId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          status: 400,
          message: 'Name, email, and password are required.'
        }
      });
    }

    const existingCustomer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          status: 400,
          message: 'An account with this email address already exists.'
        }
      });
    }

    const newCustomer = await Customer.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      address: address || '',
      role: role || 'Customer',
      restaurantId: restaurantId || null
    });

    const token = generateToken(newCustomer._id, newCustomer.role, newCustomer.restaurantId);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        token: token,
        customer: {
          id: newCustomer._id,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          role: newCustomer.role,
          restaurantId: newCustomer.restaurantId
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * getCurrentCustomerProfile
 */
const getCurrentCustomerProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password').populate('restaurantId');
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          status: 404,
          message: 'Customer record not found.'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginCustomer,
  registerCustomer,
  getCurrentCustomerProfile
};
