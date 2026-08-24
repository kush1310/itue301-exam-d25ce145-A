/**
 * Restaurant Model Definition
 *
 * Defines the Mongoose schema and persistence logic for the Restaurant entity
 * in the QuickBite Food Ordering System.
 *
 * @validates - Name required, cuisine required, rating between 0 and 5, isOpen boolean with default true.
 * @edge-cases - Boundary ratings (<0 or >5), whitespace trimming on name and cuisine.
 */

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required.'],
      trim: true,
      minlength: [2, 'Restaurant name must be at least 2 characters long.']
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine type is required.'],
      trim: true
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [0, 'Rating cannot be less than 0.'],
      max: [5, 'Rating cannot exceed 5.']
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    menu: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        category: { type: String, default: 'Main' }
      }
    ],
    address: {
      type: String,
      default: 'Main Campus Road, Changa'
    },
    deliveryTimeMinutes: {
      type: Number,
      default: 30
    }
  },
  {
    timestamps: true,
    collection: 'Restaurant'
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
