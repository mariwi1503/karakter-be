const router = require("express").Router();
const auth = require("../middleware/auth");
const soalController = require("../controllers/soalController");

router.post("/soal", auth.admin, soalController.create);
router.get("/soal/list", auth.user, soalController.getAll);
router.get("/soal/:categoryId", auth.user, soalController.getByCategory);
router.put("/soal/:id", auth.user, soalController.update);
router.delete("/soal/:id", auth.user, soalController.delete);

module.exports = router;
