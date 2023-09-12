const router = require("express").Router(),
  authController = require("../controllers/authController"),
  auth = require("../middleware/auth");
(auth = require("../middleware/auth")), (config = require("../config"));

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.put("/auth/logout", auth.user, authController.logout);
router.post("/auth/forgot-password", authController.forgotPassword);

module.exports = router;
