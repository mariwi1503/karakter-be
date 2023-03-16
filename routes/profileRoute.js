const router = require("express").Router();
const auth = require("../middleware/auth");
const profileController = require("../controllers/profileController");

router.get("/profile", auth.user, profileController.get);
router.put("/profile", auth.user, profileController.update);

module.exports = router;
