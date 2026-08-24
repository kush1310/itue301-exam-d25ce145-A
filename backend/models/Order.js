/**
 * Order Model Definition
 *
 * Defines the Mongoose schema and persistence logic for the Order entity
 * in the QuickBite Food Ordering System.
 *
 * @validates - customerId reference to Customer, restaurantId reference to Restaurant,
 *              items non-empty array, totalAmount >= 0, status must be one of the defined enums.
 * @edge-cases - Invalid ObjectId format rejection, negative totalAmount, status transitions outside enum.
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Order item name is required.'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required.'],
      min: [1, 'Quantity must be at least 1.']
    },
    price: {
      type: Number,
      required: [true, 'Item unit price is required.'],
      min: [0, 'Price cannot be negative.']
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID reference is required.']
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID reference is required.']
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item.'],
      validate: {
        validator: function (itemsArray) {
          return Array.isArray(itemsArray) && itemsArray.length > 0;
        },
        message: 'Order items array cannot be empty.'
      }
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required.'],
      min: [0, 'Total amount must be greater than or equal to 0.']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        message: 'Status must be one of: pending, preparing, out-for-delivery, delivered, cancelled.'
      },
      default: 'pending'
    },
    deliveryAddress: {
      type: String,
      default: 'Hostel Block A, CHARUSAT Campus, Changa'
    }
  },
  {
    timestamps: true,
    collection: 'Order'
  }
);

module.exports = mongoose.model('Order', orderSchema);
