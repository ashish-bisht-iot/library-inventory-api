export function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

export function logAnalytics(action, meta = {}) {
  console.log(`[Analytics] User interacted with Express API — action: ${action}`, meta);
}
