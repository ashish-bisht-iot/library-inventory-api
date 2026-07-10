export function timeoutGuard(ms = 8000) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          error: {
            code: "REQUEST_TIMEOUT",
            message: "The request took too long to complete. Please retry.",
          },
        });
      }
    }, ms);

    res.on("finish", () => clearTimeout(timer));
    next();
  };
}
