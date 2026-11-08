const router = require("express").Router();
const c = require("../controllers/productController");
const { authenticate, requireAdmin } = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", c.getAll);
router.get("/:id", validateObjectId, c.getOne);
router.post("/", authenticate, requireAdmin, c.create);
router.put("/:id", authenticate, requireAdmin, validateObjectId, c.update);
router.delete("/:id", authenticate, requireAdmin, validateObjectId, c.remove);

module.exports = router;
