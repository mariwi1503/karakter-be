const router = require("express").Router(),
  nilaiController = require("../controllers/nilaiController"),
  auth = require("../middleware/auth");

// queyr: category_id
router.post("/nilai", auth.user, nilaiController.submit);
router.get("/nilai/list", auth.user, nilaiController.getAll);
router.get("/nilai/:siswaId", auth.user, nilaiController.getOne);

module.exports = router;
