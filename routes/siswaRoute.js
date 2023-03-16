const router = require("express").Router();
const siswacontroller = require("../controllers/siswaController");
const auth = require("../middleware/auth");

router.post("/siswa", auth.user, siswacontroller.create);
router.get("/siswa", auth.user, siswacontroller.getAll);
router.get("/siswa/:id", auth.user, siswacontroller.getOne);
router.put("/siswa/:id", auth.user, siswacontroller.update);
// router.delete("/siswa/:id");

module.exports = router;
