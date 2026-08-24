/**
 * Order Controller
 *
 * Handles order placement, customer & canteen owner order history retrieval,
 * Mongoose population, and order status lifecycle updates.
 */

const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Customer = require('../models/Customer');

/**
 * createOrder
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

    // Populate references
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
 * Populates customerId with name and email, and restaurantId with name and cuisine.
 * RBAC: Customer -> own orders, Restaurant Owner -> canteen orders, Admin -> all orders.
 */
const getCustomerOrders = async (req, res, next) => {
  try {
    const filterQuery = {};

    if (req.user) {
      if (req.user.role === 'Customer') {
        filterQuery.customerId = req.user.id;
      } else if (req.user.role === 'Restaurant Owner') {
        // Fetch owner's restaurant
        const user = await Customer.findById(req.user.id);
        if (user?.restaurantId) {
          filterQuery.restaurantId = user.restaurantId;
        }
      }
      // Admin sees all
    }

    const orders = await Order.find(filterQuery)
      .populate('customerId', 'name email phone')
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
