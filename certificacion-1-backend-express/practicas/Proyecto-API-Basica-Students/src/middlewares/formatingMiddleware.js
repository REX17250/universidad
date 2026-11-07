export function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null
  });
}

export function responseFormatter(req, res, next) {
  res.success = function (statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  next();
}