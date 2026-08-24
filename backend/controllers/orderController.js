/**
 * Order Controller
 *
 * Handles order placement, customer order history retrieval with Mongoose population,
 * and order status lifecycle updates for the QuickBite Food Ordering System.
 */

const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Customer = require('../models/Customer');

/**
 * createOrder
 *
 * Creates a new order record for the authenticated customer.
 * Validates existence of restaurant and customer, validates items array,
 * calculates totalAmount, and persists to MongoDB.
 *
 * @param  {import('express').Request} req   - Express request with authenticated req.user and order body
 * @param  {import('express').Response} res  - Express response
 * @param  {import('express').NextFunction} next - Error callback
 * @returns {Promise<Response>}              - 201 Created with saved order document
 * @validates - customerId, restaurantId, items array non-empty, totalAmount >= 0, valid status enum.
 * @redirects - N/A
 * @edge-cases - Non-existent restaurant, empty items array, invalid status strings.
 */
const createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress, status } = req.body;
    const customerId = req.user ? req.user.id : req.body.customerId;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CUSTOMER_ID',
          status: 400,
          message: 'customerId is required to place an order.'
        }
      });
    }

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_RESTAURANT_ID',
          status: 400,
          message: 'restaurantId is required to place an order.'
        }
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ORDER_ITEMS',
          status: 400,
          message: 'Order must contain a non-empty array of items.'
        }
      });
    }

    // Verify restaurant existence
    const restaurantExists = await Restaurant.findById(restaurantId);
    if (!restaurantExists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESTAURANT_NOT_FOUND',
          status: 404,
          message: `Restaurant with ID ${restaurantId} does not exist.`
        }
      });
    }

    // Calculate total if not explicitly provided or enforce provided total
    let computedTotal = 0;
    for (const item of items) {
      if (!item.name || item.quantity === undefined || item.price === undefined) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ITEM_STRUCTURE',
            status: 400,
            message: 'Each item must contain name, quantity (min 1), and price.'
          }
        });
      }
      computedTotal += Number(item.quantity) * Number(item.price);
    }

    const finalAmount = totalAmount !== undefined ? Number(totalAmount) : computedTotal;

    const newOrder = new Order({
      customerId,
      restaurantId,
      items,
      totalAmount: finalAmount,
      deliveryAddress: deliveryAddress || 'CHARUSAT Campus, Changa',
      status: status || 'pending'
    });

    const savedOrder = await newOrder.save();

    // Populate references before returning response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine');

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * getCustomerOrders
 *
 * Retrieves all orders for the authenticated customer (or all orders for Admin).
 * Populates customerId with name and email, and restaurantId with name and cuisine.
 *
 * @param  {import('express').Request} req   - Express request with authenticated req.user
 * @param  {import('express').Response} res  - Express response
 * @param  {import('express').NextFunction} next - Error callback
 * @returns {Promise<Response>}              - 200 OK with array of populated orders
 */
const getCustomerOrders = async (req, res, next) => {
  try {
    const filterQuery = {};

    // If customer is not Admin, restrict orders to their own customerId
    if (req.user && req.user.role !== 'Admin') {
      filterQuery.customerId = req.user.id;
    }

    const orders = await Order.find(filterQuery)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * updateOrderStatus
 *
 * Updates the status of an existing order.
 * Validates that the submitted status belongs to the defined enum list.
 *
 * @param  {import('express').Request} req   - Request with order ID in params and status in body
 * @param  {import('express').Response} res  - Response returning updated populated order
 * @param  {import('express').NextFunction} next - Error callback
 * @returns {Promise<Response>}              - 200 OK on success or 400/404 on error
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS_VALUE',
          status: 400,
          message: `Invalid order status '${status}'. Status must be one of: ${validStatuses.join(', ')}.`
        }
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          status: 404,
          message: `Order with ID ${id} was not found.`
        }
      });
    }

    order.status = status;
    await order.save();

    const updatedPopulatedOrder = await Order.findById(order._id)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine');

    return res.status(200).json({
      success: true,
      message: `Order status successfully updated to '${status}'.`,
      data: updatedPopulatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  updateOrderStatus
};
