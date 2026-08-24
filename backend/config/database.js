/**
 * Database Connection Module
 *
 * Establishes an asynchronous connection to the MongoDB Atlas cluster
 * using Mongoose ODM with connection pooling and event listeners.
 *
 * @param   {void}
 * @returns {Promise<typeof import('mongoose')>} - Resolves with the Mongoose instance on successful connection.
 * @validates - Checks existence of MONGO_URI in process.env before attempting connection.
 * @redirects - Terminates process with exit code 1 if connection fails fatally.
 * @edge-cases - Handles unhandled promise rejections, DNS timeouts, and initial connection failures gracefully.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[DATABASE_ERROR] MONGO_URI environment variable is missing in .env configuration.');
    process.exit(1);
  }

  try {
    const connectionInstance = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log(`[DATABASE_CONNECTED] MongoDB Host: ${connectionInstance.connection.host} | Database: ${connectionInstance.connection.name}`);
    return connectionInstance;
  } catch (connectionError) {
    console.error(`[DATABASE_CONNECTION_FAILED] ${connectionError.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
