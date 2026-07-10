import { randomUUID } from "crypto";
let books = [
  {
    id: randomUUID(),
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    publicationYear: "2008",
    genre: "Software Engineering",
    quantity: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    isbn: "9780135957059",
    publicationYear: "2019",
    genre: "Software Engineering",
    quantity: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getAllBooks() {
  return books;
}

export function getBookById(id) {
  return books.find((b) => b.id === id) || null;
}

export function searchBooks(query) {
  const q = query.trim().toLowerCase();
  if (!q) return books;
  return books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q) ||
      (b.genre && b.genre.toLowerCase().includes(q))
  );
}

export function createBook(data) {
  const now = new Date().toISOString();
  const book = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
  books.push(book);
  return book;
}

export function updateBook(id, data) {
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  books[idx] = { ...books[idx], ...data, updatedAt: new Date().toISOString() };
  return books[idx];
}

export function deleteBook(id) {
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  books.splice(idx, 1);
  return true;
}

export function _resetStore(next) {
  books = next;
}
