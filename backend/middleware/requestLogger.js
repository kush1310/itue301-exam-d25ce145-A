/**
 * Global Request Logger Middleware
 *
 * Intercepts every incoming HTTP request and outputs a structured log line
 * containing HTTP Method, Request URL Path, and ISO-8601 Timestamp.
 *
 * @param  {import('express').Request} req   - Express request object
 * @param  {import('express').Response} res  - Express response object
 * @param  {import('express').NextFunction} next - Express next middleware callback
 * @returns {void}
 * @validates - N/A (observational logging middleware)
 * @redirects - N/A
 * @edge-cases - Handles empty query strings and custom headers cleanly.
 */

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.originalUrl || req.url} [${timestamp}]`);
  next();
};

module.exports = requestLogger;
