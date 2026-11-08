const express = require("express");
const cors = require("cors");
const { apiLimiter } = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: (process.env.CLIENT_URL || "http://localhost:5173").split(",") }));
app.use(express.json());

app.get("/", (_req, res) => res.json({ success: true, message: "DzStore API is running" }));

app.use("/api", apiLimiter); // general rate limit on all API endpoints
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
