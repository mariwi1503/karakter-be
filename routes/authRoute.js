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
    console.log(req.header.toString());
    const data = axios.post(
      "https://abi-cash.abhitech-cloud.com/api/loan-applications/callback"
    );
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
