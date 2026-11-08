const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HttpError = require("../utils/HttpError");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (user) =>
  jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    const errors = [];
    if (typeof name !== "string" || !name.trim()) errors.push("name is required");
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) errors.push("a valid email is required");
    if (typeof password !== "string" || password.length < 6) errors.push("password is required (min 6 characters)");
    if (errors.length) throw new HttpError(400, "Validation failed", errors);

    const normalized = email.trim().toLowerCase();
    if (await User.findOne({ email: normalized })) throw new HttpError(409, "Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    const role = process.env.ADMIN_EMAIL && normalized === process.env.ADMIN_EMAIL.trim().toLowerCase() ? "admin" : "user";
    const user = await User.create({ name: name.trim(), email: normalized, passwordHash, role });
    res.status(201).json({ success: true, message: "User registered", token: signToken(user), tokenType: "Bearer", user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      throw new HttpError(400, "Validation failed", ["email and password are required"]);
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) throw new HttpError(401, "Invalid email or password");

    res.status(200).json({ success: true, token: signToken(user), tokenType: "Bearer", user });
  } catch (err) {
    next(err);
  }
};

// Shows who the token belongs to (works with a local JWT or an OAuth2 token)
exports.me = async (req, res, next) => {
  try {
    const user = req.auth.type === "local" ? await User.findById(req.auth.userId) : null;
    res.status(200).json({ success: true, user: user || { email: req.auth.email, role: "user" } });
  } catch (err) { next(err); }
};
