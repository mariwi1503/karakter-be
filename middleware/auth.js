"use strict";

const jwtLib = require("../libraries/jwtLib");
const config = require("../config");
module.exports = {
  user: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) throw new Error("Acces denied!");

      let verified = jwtLib.verify(token, config.jwtSecret);
      if (!verified) throw new Error("Unauthorized");

      req.userId = verified.id;
      req.user = verified;

      next();
    } catch (error) {
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  admin: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) throw new Error("Acces denied!");

      let verified = jwtLib.verify(token, config.jwtSecret);
      if (!verified) throw new Error("Unauthorized");
      if (verified.role != "admin") throw new Error("Admin Only!");

      req.userId = verified.id;
      req.user = verified;

      next();
    } catch (error) {
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },
};
