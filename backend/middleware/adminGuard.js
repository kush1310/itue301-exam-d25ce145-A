/**
 * Admin Authorization Guard Middleware (RBAC)
 *
 * Enforces role-based access control by inspecting req.user (populated by authGuard).
 * Allows execution to proceed only if req.user.role === 'Admin' or 'Restaurant Owner'.
 * Rejects regular Customer accounts with HTTP 403 Forbidden.
 *
 * @param  {import('express').Request} req   - Express request with authenticated req.user
 * @param  {import('express').Response} res  - Express response object
 * @param  {import('express').NextFunction} next - Next middleware callback
 * @returns {Response|void}                 - 403 Forbidden or next()
 * @validates - User role property in decoded JWT payload.
 * @redirects - N/A
 * @edge-cases - req.user undefined, customer role attempting admin status modifications.
 */

const adminGuard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        status: 401,
        message: 'Authentication required prior to role verification.'
      }
    });
  }

  if (req.user.role !== 'Admin' && req.user.role !== 'Restaurant Owner') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN_ROLE_ACCESS',
        status: 403,
        message: 'Access Denied. You do not possess administrative permissions for this operation.'
      }
    });
  }

  next();
};

module.exports = adminGuard;
