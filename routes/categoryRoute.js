const router = require("express").Router(),
  auth = require("../middleware/auth"),
  categoryController = require("../controllers/categoryController");

router.get("/category", auth.user, categoryController.getAll);
router.get("/category/:id", auth.user, categoryController.getOne);
router.post("/category", auth.admin, categoryController.create);

module.exports = router;
