export function sanitizeText(value) {
  if (typeof value !== "string") return value;

  return value
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/["']/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 1000);
}

export function sanitizeBody(body) {
  const clean = {};
  for (const [key, value] of Object.entries(body)) {
    clean[key] = typeof value === "string" ? sanitizeText(value) : value;
  }
  return clean;
}
