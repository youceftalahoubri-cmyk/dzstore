// All errors are returned as: { success: false, message, errors? }
function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: `Invalid value for ${err.path}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate value: resource already exists" });
  }
  if (err.status) {
    const body = { success: false, message: err.message };
    if (err.errors) body.errors = err.errors;
    return res.status(err.status).json(body);
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}

module.exports = { notFound, errorHandler };
