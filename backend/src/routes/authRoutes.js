const router = require("express").Router();
const { register, login, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me", authenticate, me);

module.exports = router;
