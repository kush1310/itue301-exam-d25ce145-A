/**
 * QuickBite Food Ordering System — Express Application Entry Point
 *
 * ITUE301 Advanced Web Development Frameworks Practical Exam (Set A)
 * Charotar University of Science and Technology (CSPIT)
 *
 * Initializes Express HTTP server, establishes MongoDB connection via Mongoose,
 * applies global logging and security middlewares, mounts REST API routes,
 * and attaches centralized error handlers.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const connectDB = require('./config/database');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Instantiate Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Global Core Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Task 3: Global requestLogger middleware logging [METHOD] [PATH] [TIMESTAMP]
app.use(requestLogger);

// API Documentation / Health Check Root
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QuickBite Food Ordering System REST API is running.',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/v1/auth/login',
        register: 'POST /api/v1/auth/register',
        profile: 'GET /api/v1/auth/profile (Protected)'
      },
      restaurants: {
        listAll: 'GET /api/v1/restaurants (Public)',
        getById: 'GET /api/v1/restaurants/:id (Public)',
        create: 'POST /api/v1/restaurants (Protected)'
      },
      orders: {
        create: 'POST /api/v1/orders (Protected)',
        listCustomerOrders: 'GET /api/v1/orders (Protected, Populated)',
        updateStatus: 'PATCH /api/v1/orders/:id/status (Protected)'
      }
    }
  });
});

// REST API Route Mounts at /api/v1/
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', orderRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      status: 404,
      message: `The requested endpoint ${req.method} ${req.originalUrl} was not found on this server.`
    }
  });
});

// Task 3: Centralized Global Error Handling Middleware (Last middleware)
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[SERVER_RUNNING] QuickBite Express API listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`[API_BASE_URL] http://localhost:${PORT}/api/v1/`);
});

// Process event handlers for unexpected errors
process.on('unhandledRejection', (err) => {
  console.error(`[UNHANDLED_REJECTION] Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
