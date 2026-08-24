/**
 * Centralized Global Error Handling Middleware
 *
 * Catches all synchronous and asynchronous errors passed via next(err).
 * Sanitizes the error and returns a clean, structured JSON response
 * conforming to REST API standards without exposing internal server stack traces.
 *
 * @param  {Error} err                      - Caught exception or error object
 * @param  {import('express').Request} req   - Express request object
 * @param  {import('express').Response} res  - Express response object
 * @param  {import('express').NextFunction} next - Express next function
 * @returns {Response}                      - Structured JSON error response with appropriate HTTP status
 * @validates - Mongoose ValidationError, CastError, duplicate keys (11000), custom application errors.
 * @redirects - N/A
 * @edge-cases - Errors missing statusCode or status property, null errors, non-string messages.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = null;

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Schema validation failed.';
    details = Object.values(err.errors).map((val) => val.message);
  }

  // Handle Mongoose Invalid ObjectId CastError
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource identifier: ${err.value}`;
    details = `Field '${err.path}' must be a valid 24-character hexadecimal ObjectId.`;
  }

  // Handle MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value error: A record with that ${duplicatedField} already exists.`;
    details = err.keyValue;
  }

  // Handle JSON Web Token Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token failure.';
    details = err.message;
  }

  console.error(`[ERROR_HANDLER] Status: ${statusCode} | Message: ${message}`);

  return res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'API_ERROR',
      status: statusCode,
      message: message,
      details: details
    }
  });
};

module.exports = errorHandler;
