/**
 * JWT Authentication Guard Middleware
 *
 * Validates the JSON Web Token provided in the Authorization header (Bearer scheme).
 * On successful verification, attaches the decoded customer payload to req.user.
 * On missing or invalid token, terminates the request with a structured 401 response.
 *
 * @param  {import('express').Request} req   - Express request object with Authorization header
 * @param  {import('express').Response} res  - Express response object
 * @param  {import('express').NextFunction} next - Express next middleware callback
 * @returns {Response|void}                 - Returns 401 JSON on failure, calls next() on success.
 * @validates - Bearer prefix presence, JWT token cryptographic signature, token expiry.
 * @redirects - N/A (API middleware)
 * @edge-cases - Malformed Bearer header, expired token, altered signature, non-existent secret.
 */

const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_MISSING',
        message: 'Access denied. Missing or malformed Bearer authorization token.',
        status: 401
      }
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.trim() === '') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_EMPTY',
        message: 'Access denied. Authorization token cannot be empty.',
        status: 401
      }
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'quickbite_super_secure_jwt_secret_key_2026_exam_token';
    const decodedPayload = jwt.verify(token, jwtSecret);
    req.user = decodedPayload;
    next();
  } catch (verificationError) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_INVALID',
        message: 'Access denied. Authorization token is invalid or has expired.',
        status: 401,
        details: verificationError.message
      }
    });
  }
};

module.exports = authGuard;
