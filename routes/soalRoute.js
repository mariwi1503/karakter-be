const router = require("express").Router();
const auth = require("../middleware/auth");
const soalController = require("../controllers/soalController");

router.post("/soal/create", auth.admin, soalController.create);
router.get("/soal/list", auth.user, soalController.getAll);
router.put("/soal/update", auth.admin, soalController.update);
router.get("/soal/:categoryId", auth.user, soalController.getByCategory);
router.delete("/soal/:id", auth.admin, soalController.delete);

module.exports = router;
