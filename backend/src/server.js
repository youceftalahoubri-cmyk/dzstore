require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined. Check your .env file.");
    await connectDB();
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
})();
