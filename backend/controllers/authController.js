/**
 * Authentication Controller
 *
 * Handles customer authentication, registration, and JWT token issuance
 * for the QuickBite Food Ordering System.
 */

const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

/**
 * generateToken Helper
 *
 * Signs a JSON Web Token with customer identifier and payload.
 *
 * @param  {string} id   - Customer MongoDB ObjectId
 * @param  {string} role - User authorization role
 * @returns {string}     - Signed JWT Bearer token string
 */
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'quickbite_super_secure_jwt_secret_key_2026_exam_token';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id, role }, secret, { expiresIn });
};

/**
 * loginCustomer
 *
 * Validates submitted customer credentials against the database.
 * On success, generates a signed JWT and returns customer details.
 *
 * @param  {import('express').Request} req   - Request containing { email, password }
 * @param  {import('express').Response} res  - Response returning token and customer profile
 * @param  {import('express').NextFunction} next - Next error callback
 * @returns {Promise<Response>}              - 200 OK with token or 401 Unauthorized
 * @validates - Email format, password presence, customer existence, password match.
 * @redirects - N/A
 * @edge-cases - Non-existent email, incorrect password, inactive customer profile.
 */
const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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

    const customer = await Customer.findOne({ email: email.toLowerCase().trim() });

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

    const token = generateToken(customer._id, customer.role);

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
          role: customer.role
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
 * Registers a new customer account and returns a signed JWT.
 *
 * @param  {import('express').Request} req   - Request body with name, email, password, phone, address
 * @param  {import('express').Response} res  - Response with 201 Created and JWT token
 * @param  {import('express').NextFunction} next - Error middleware callback
 * @returns {Promise<Response>}
 */
const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

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
          message: 'A customer account with this email address already exists.'
        }
      });
    }

    const newCustomer = await Customer.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      address: address || '',
      role: role || 'Customer'
    });

    const token = generateToken(newCustomer._id, newCustomer.role);

    return res.status(201).json({
      success: true,
      message: 'Customer account registered successfully.',
      data: {
        token: token,
        customer: {
          id: newCustomer._id,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          role: newCustomer.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * getCurrentCustomerProfile
 *
 * Returns current customer profile from authenticated JWT session.
 */
const getCurrentCustomerProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');
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
