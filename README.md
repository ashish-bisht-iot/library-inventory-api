# Library Book Inventory — Express REST API (ENG-98986)

A REST API replacing Library Book Inventory's paper/Excel tracking with proper CRUD endpoints.

## A note on the TRD
This ticket's requirements doc reads like it was copied from a frontend ticket template — a few
items (Lighthouse accessibility score, "highlight fields in red", monochromatic design system) only
make sense for a UI, and this ticket is backend-only. Rather than skip them, I mapped each one to its
closest backend equivalent so the intent is still honored:

| TRD requirement | Frontend meaning | Backend implementation |
|---|---|---|
| Empty states | Blank screen → friendly message | `GET /api/books` returns `200` with `count: 0` and a `message` field instead of a bare `[]` |
| Bad connectivity / loading indicator | Spinner during async calls | `timeoutGuard` middleware returns a clean `503` instead of hanging or crashing if a request stalls |
| Invalid inputs / red highlighting | Red field borders, blocked submit | `400` response with a `fields: { fieldName: "message" }` map, request rejected before it touches the store |
| 100% Lighthouse a11y score | N/A — no UI | Not applicable; flagged for Amit if this ticket gets a frontend companion |
| Telemetry simulation | Console ping on primary actions | `[Analytics] User interacted with Express API` logs on every create/update/delete |
| Security / XSS sanitization | Sanitize before storing in state | Every text field runs through `sanitizeText()` before it's written to the store |
| Monochromatic design, 16/32px spacing | N/A — no UI | Not applicable |

Worth a quick Slack to Amit flagging the mismatch, in case a frontend half of this ticket got dropped.

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

## Run locally
```
npm install
cp .env.example .env
npm run dev
```
Server starts on `http://localhost:5000` (or `PORT` from `.env`).

## Lint (matches DoD checklist)
```
npm run lint    # should report 0 problems
```

## Manual smoke test
```
curl localhost:5000/health
curl localhost:5000/api/books
curl -X POST localhost:5000/api/books -H "Content-Type: application/json" \
  -d '{"title":"Refactoring","author":"Martin Fowler","isbn":"9780134757599","publicationYear":"2018","quantity":3}'
```

## Deploy
Same Render flow as Data Hub:
1. Push this repo to GitHub.
2. Render → New → Web Service → connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Set `PORT` env var if Render doesn't inject one automatically (it usually does).

Currently uses an in-memory store, same starting point Data Hub had before its MongoDB migration —
swap `src/data/bookStore.js` for a Mongoose model later the same way, if the client needs persistence
across restarts.
