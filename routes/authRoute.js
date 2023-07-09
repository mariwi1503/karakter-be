const router = require("express").Router(),
  authController = require("../controllers/authController"),
  auth = require("../middleware/auth");

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.put("/auth/logout", auth.user, authController.logout);

// for testing xendit callback
router.post("/callback", async (req, res) => {
  try {
    console.log(req.header.toString());
    res.status(200).json({
      message: "oke",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
