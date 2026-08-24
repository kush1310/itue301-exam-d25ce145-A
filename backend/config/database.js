/**
 * Database Connection Module
 *
 * Establishes an asynchronous connection to the MongoDB Atlas cluster
 * using Mongoose ODM with automated retry logic and exponential backoff.
 *
 * @param   {number} [retryCount=0] - Current connection attempt count
 * @returns {Promise<typeof import('mongoose')>} - Resolves with Mongoose instance
 * @validates - Checks presence of MONGO_URI in environment variables.
 * @redirects - Terminates process if max retries exceeded.
 * @edge-cases - Transient SSL handshake errors, network latency, DNS resolution glitches.
 */

const mongoose = require('mongoose');

const MAX_RETRIES = 5;

const connectDB = async (retryCount = 0) => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[DATABASE_ERROR] MONGO_URI environment variable is missing in .env configuration.');
    process.exit(1);
  }

  try {
    const connectionInstance = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      family: 4 // Use IPv4 for stability across proxies
    });

    console.log(`[DATABASE_CONNECTED] MongoDB Host: ${connectionInstance.connection.host} | Database: ${connectionInstance.connection.name}`);
    return connectionInstance;
  } catch (connectionError) {
    console.error(`[DATABASE_CONNECTION_ATTEMPT_${retryCount + 1}_FAILED] ${connectionError.message}`);

    if (retryCount < MAX_RETRIES) {
      const backoffMs = Math.min(1000 * Math.pow(2, retryCount), 8000);
      console.log(`[DATABASE_RETRY] Retrying MongoDB connection in ${backoffMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      return connectDB(retryCount + 1);
    } else {
      console.error('[DATABASE_FATAL] Maximum MongoDB connection retries exceeded.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
