const rateLimit = require("express-rate-limit");

const WINDOW_MS = 15 * 60 * 1000;

const handler = (message) => (_req, res) =>
  res.status(429).json({ success: false, message });

// General limit: 100 requests / 15 min per IP for all /api endpoints
const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handler("Too many requests. Please try again in 15 minutes."),
});

// Stricter limit for login: 5 requests / 15 min per IP (brute-force protection)
const loginLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handler("Too many login attempts. Please try again in 15 minutes."),
});

module.exports = { apiLimiter, loginLimiter };
