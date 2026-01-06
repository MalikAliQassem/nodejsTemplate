// const { UnauthorizedError } = require("../util/errors");

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Authentication required",
          code: "AUTH_REQUIRED",
        },
      });
    } else {
      return res.redirect("/login");
    }
  }

  next();
};

/**
 * Middleware to check if user is not authenticated (for login/register pages)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect("/dashboard");
  }

  next();
};

/**
 * Middleware to add user information to response locals
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const addUserToLocals = (req, res, next) => {
  res.locals.isAuthenticated = !!(req.session && req.session.userId);
  res.locals.userId = req.session?.userId || null;

  next();
};

module.exports = {
  requireAuth,
  requireGuest,
  addUserToLocals,
};
