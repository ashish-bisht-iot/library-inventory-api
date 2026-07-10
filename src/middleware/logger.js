// Custom logger (no morgan/winston per the "core logic first, keep it
// simple" brief) — same shape as the logger built for Data Hub.
export function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

// Telemetry Simulation per TRD. Fires on primary write actions
// (create / update / delete), not on read-only GETs.
export function logAnalytics(action, meta = {}) {
  console.log(`[Analytics] User interacted with Express API — action: ${action}`, meta);
}
