const router = require("express").Router(),
  authController = require("../controllers/authController"),
  auth = require("../middleware/auth"),
  axios = require("axios"),
  config = require("../config");

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.put("/auth/logout", auth.user, authController.logout);

// for testing xendit callback
router.post(
  "/callback",
  async (req, res, next) => {
    try {
      const cbToken = req.headers["x-callback-token"];
      if (cbToken !== config.callbackToken) {
        throw new Error("Token invalid");
      }
      next();
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  async (req, res) => {
    try {
      const headers = { "X-Callback-Token": req.headers["x-callback-token"] };
      const data = axios.post(
        "http://209.97.163.32:4000/api/loan-applications/callback",
        req.body,
        { headers }
      );
      res.status(200).json({
        message: "Success",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;
