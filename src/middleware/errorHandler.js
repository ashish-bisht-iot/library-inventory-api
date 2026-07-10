export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `No route matches ${req.method} ${req.originalUrl}.`,
    },
  });
}

export function globalErrorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl} —`, err.message);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: status === 500 ? "Something went wrong on our end. Please try again." : err.message,
    },
  });
}
