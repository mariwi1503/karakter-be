const router = require("express").Router(),
  auth = require("../middleware/auth"),
  categoryController = require("../controllers/categoryController");

router.get("/category", auth.user, categoryController.getAll);
router.post("/category", auth.admin, categoryController.create);
router.get("/category/:id", auth.user, categoryController.getOne);
router.put("/category/:id", auth.admin, categoryController.update);
router.delete("/category/:id", auth.admin, categoryController.delete);

module.exports = router;
