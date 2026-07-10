const ISBN_RE = /^(?:\d{9}[\dX]|\d{13})$/; // ISBN-10 or ISBN-13, digits only (hyphens stripped by caller)
const YEAR_RE = /^(1[5-9]\d{2}|20\d{2})$/; // 1500-2099, sanity range for publication year

export function validateBookPayload(body, { partial = false } = {}) {
  const errors = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);

  if (!partial || has("title")) {
    const title = (body.title ?? "").toString().trim();
    if (!title) errors.title = "Title is required.";
    else if (title.length > 200) errors.title = "Title must be 200 characters or fewer.";
  }

  if (!partial || has("author")) {
    const author = (body.author ?? "").toString().trim();
    if (!author) errors.author = "Author is required.";
    else if (author.length > 120) errors.author = "Author must be 120 characters or fewer.";
  }

  if (!partial || has("isbn")) {
    const isbn = (body.isbn ?? "").toString().replace(/-/g, "");
    if (!isbn) errors.isbn = "ISBN is required.";
    else if (!ISBN_RE.test(isbn)) errors.isbn = "ISBN must be a valid 10 or 13-digit ISBN.";
  }

  if (!partial || has("publicationYear")) {
    const year = String(body.publicationYear ?? "");
    if (!year) errors.publicationYear = "Publication year is required.";
    else if (!YEAR_RE.test(year)) errors.publicationYear = "Enter a 4-digit year between 1500 and 2099.";
  }

  if (!partial || has("quantity")) {
    const qty = body.quantity;
    if (qty === undefined || qty === null || qty === "") {
      errors.quantity = "Quantity is required.";
    } else if (!Number.isInteger(Number(qty)) || Number(qty) < 0) {
      errors.quantity = "Quantity must be a whole number of 0 or more.";
    }
  }

  if (has("genre") && body.genre && body.genre.toString().length > 60) {
    errors.genre = "Genre must be 60 characters or fewer.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
