/**
 * Customer Model Definition
 *
 * Defines the Mongoose schema and persistence logic for the Customer entity
 * in the QuickBite Food Ordering System.
 * Supports roles: 'Customer', 'Restaurant Owner', 'Admin'
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required.'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters long.']
    },
    email: {
      type: String,
      required: [true, 'Customer email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address conforming to standard format.'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required for customer authentication.'],
      minlength: [6, 'Password must contain at least 6 characters.']
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    address: {
      type: String,
      default: '',
      trim: true
    },
    role: {
      type: String,
      enum: ['Customer', 'Restaurant Owner', 'Admin'],
      default: 'Customer'
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'Customer'
  }
);

/**
 * Pre-save Middleware
 * Automatically hashes plaintext password before storing in MongoDB.
 */
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * matchPassword Method
 * Compares candidate plaintext password with stored bcrypt hash.
 */
customerSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
