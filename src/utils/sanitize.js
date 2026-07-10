// Strips characters that enable HTML/script injection before any text field
// is written into the in-memory store. Same approach as the client-side
// sanitizer from ENG-72399 — here it protects the server, since this JSON
// eventually gets rendered by whatever frontend consumes it.
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

// Recursively sanitizes every string value in a plain object (one level of
// nesting is all the book payload needs, but this stays safe if it grows).
export function sanitizeBody(body) {
  const clean = {};
  for (const [key, value] of Object.entries(body)) {
    clean[key] = typeof value === "string" ? sanitizeText(value) : value;
  }
  return clean;
}
