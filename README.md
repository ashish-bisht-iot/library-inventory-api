# Library Book Inventory — Express REST API

A REST API replacing Library Book Inventory's paper/Excel tracking with proper CRUD endpoints.

## Endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/api/books` | List all books, or `?query=` to search title/author/ISBN/genre |
| GET | `/api/books/:id` | Get one book |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/:id` | Partially update a book |
| DELETE | `/api/books/:id` | Delete a book |

### Book payload
```json
{
  "title": "Refactoring",
  "author": "Martin Fowler",
  "isbn": "9780134757599",
  "publicationYear": "2018",
  "genre": "Software Engineering",
  "quantity": 3
}
```

All responses use a standardized envelope: `{ success, data }` on success, `{ success: false, error: { code, message, fields? } }` on failure.

## Manual smoke test
```
curl localhost:5000/health
curl localhost:5000/api/books
curl -X POST localhost:5000/api/books -H "Content-Type: application/json" \
  -d '{"title":"Refactoring","author":"Martin Fowler","isbn":"9780134757599","publicationYear":"2018","quantity":3}'
```
