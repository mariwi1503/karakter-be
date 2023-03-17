const router = require("express").Router(),
  authController = require("../controllers/authController"),
  auth = require("../middleware/auth");

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.put("/auth/logout", auth.user, authController.logout);

module.exports = router;
