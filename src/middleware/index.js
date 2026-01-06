const { ValidationError } = require("../util/errors");

const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

const errorHandler = (err, req, res) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: "VALIDATION_ERROR",
      },
    });
  }

  console.error("Unexpected error:", err);
  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    },
  });
};

module.exports = {
  requestLogger,
  validateRequest,
  errorHandler,
};
