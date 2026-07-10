import express from "express";
import dotenv from "dotenv";
import booksRouter from "./routes/books.js";
import { requestLogger } from "./middleware/logger.js";
import { timeoutGuard } from "./middleware/timeoutGuard.js";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "100kb" }));
app.use(requestLogger);
app.use(timeoutGuard(8000));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok", uptime: process.uptime() });
});

app.use("/api/books", booksRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Library Book Inventory API listening on port ${PORT}`);
});

export default app;
