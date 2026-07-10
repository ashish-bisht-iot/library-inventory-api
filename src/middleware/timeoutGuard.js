// TRD asks the client to assume "a slow 3G connection" and never crash.
// On the server side that means: never let a hung request take the process
// down, and always answer with a clean, retryable JSON error instead of
// letting the socket hang or the server throw unhandled.
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
