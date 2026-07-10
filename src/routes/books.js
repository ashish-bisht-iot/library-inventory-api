import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../data/bookStore.js";
import { sanitizeBody } from "../utils/sanitize.js";
import { validateBookPayload } from "../utils/validation.js";
import { logAnalytics } from "../middleware/logger.js";

const router = Router();

// GET /api/books?query=clean+code
// "Empty state" requirement: an empty result set is still a 200 with a
// clear message, never a bare [] with no explanation and never a 404.
router.get("/", (req, res) => {
  const { query } = req.query;
  const results = query ? searchBooks(query) : getAllBooks();

  res.status(200).json({
    success: true,
    count: results.length,
    message: results.length === 0 ? "No data found for this search." : undefined,
    data: results,
  });
});

// GET /api/books/:id
router.get("/:id", (req, res) => {
  const book = getBookById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      error: { code: "BOOK_NOT_FOUND", message: `No book found with id ${req.params.id}.` },
    });
  }

  res.status(200).json({ success: true, data: book });
});

// POST /api/books
// "Invalid inputs" requirement: malformed/missing fields are rejected
// with a per-field error map instead of silently accepting bad data.
router.post("/", (req, res) => {
  const clean = sanitizeBody(req.body ?? {});
  const { valid, errors } = validateBookPayload(clean);

  if (!valid) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "One or more fields are invalid.", fields: errors },
    });
  }

  const book = createBook({
    title: clean.title.trim(),
    author: clean.author.trim(),
    isbn: clean.isbn.toString().replace(/-/g, ""),
    publicationYear: String(clean.publicationYear),
    genre: clean.genre ? clean.genre.trim() : "General",
    quantity: Number(clean.quantity),
  });

  logAnalytics("book_created", { id: book.id, title: book.title });
  res.status(201).json({ success: true, data: book });
});

// PUT /api/books/:id — partial update allowed
router.put("/:id", (req, res) => {
  const existing = getBookById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { code: "BOOK_NOT_FOUND", message: `No book found with id ${req.params.id}.` },
    });
  }

  const clean = sanitizeBody(req.body ?? {});
  const { valid, errors } = validateBookPayload(clean, { partial: true });

  if (!valid) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "One or more fields are invalid.", fields: errors },
    });
  }

  const patch = { ...clean };
  if (patch.isbn) patch.isbn = patch.isbn.toString().replace(/-/g, "");
  if (patch.quantity !== undefined) patch.quantity = Number(patch.quantity);

  const updated = updateBook(req.params.id, patch);
  logAnalytics("book_updated", { id: updated.id });
  res.status(200).json({ success: true, data: updated });
});

// DELETE /api/books/:id
router.delete("/:id", (req, res) => {
  const removed = deleteBook(req.params.id);

  if (!removed) {
    return res.status(404).json({
      success: false,
      error: { code: "BOOK_NOT_FOUND", message: `No book found with id ${req.params.id}.` },
    });
  }

  logAnalytics("book_deleted", { id: req.params.id });
  res.status(200).json({ success: true, message: "Book deleted." });
});

export default router;
