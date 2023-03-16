"use strict";

const jwtLib = require("../libraries/jwtLib");
const config = require("../config");
const { User } = require("../models");
module.exports = {
  user: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) throw new Error("Acces denied!");

      let verified = jwtLib.verify(token, config.jwtSecret);
      if (!verified) throw new Error("Unauthorized");
      const user = await User.findOne({
        where: { id: verified.id },
        attributes: { exclude: ["password"] },
      });
      if (!user) throw new Error("User tidak dikenal");
      if (user.token != token) throw new Error("Session anda telah habis");

      req.userId = user.id;
      req.user = user;

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
      const user = await User.findOne({
        where: { id: verified.id },
        attributes: { exclude: ["password"] },
      });
      if (!user) throw new Error("User tidak dikenal");
      if (user.token != token) throw new Error("Session anda telah habis");
      if (user.role != "admin") throw new Error("Admin Only!");

      req.userId = user.id;
      req.user = user;

      next();
    } catch (error) {
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },
};
