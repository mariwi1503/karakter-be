const router = require("express").Router(),
  authController = require("../controllers/authController"),
  auth = require("../middleware/auth"),
  axios = require("axios");

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.put("/auth/logout", auth.user, authController.logout);

// for testing xendit callback
router.post("/callback", async (req, res) => {
  try {
    // console.log(req.header.toString());
    const data = axios.post(
      "http://209.97.163.32:4000/api/loan-applications/callback",
      req.body
    );
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
