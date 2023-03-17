"use strict";

const { User } = require("../models"),
  bcrypt = require("../libraries/bcryptLib"),
  jwtLib = require("../libraries/jwtLib"),
  validation = require("../libraries/JoiLib"),
  sendEmail = require("../helper/sendEmail");

module.exports = {
  signup: async (req, res) => {
    try {
      const payload = await validation.signupSchema.validateAsync(req.body);
      let {
        nama,
        username,
        jabatan = null,
        nip = null,
        password,
        instansi = null,
      } = payload;

      const userExist = await User.findOne({ where: { username } });
      if (userExist) throw new Error("username sudah digunakan");

      password = bcrypt.hasher(password);

      await User.create({
        nama,
        username,
        jabatan,
        nip,
        password,
        instansi,
      });

      res.status(201).json({
        status: "Success",
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const payload = await validation.loginSchema.validateAsync(req.body);
      const { username, password } = payload;

      // user exist check
      const user = await User.findOne({ where: { username } });
      if (!user) throw new Error("Username belum terdaftar");

      // validate password
      const passwordMatch = bcrypt.checker(password, user.password);
      if (!passwordMatch) throw new Error("Password anda salah");

      // generate token
      const token = jwtLib.generate({
        id: user.id,
      });

      await User.update({ token }, { where: { username } });
      res.status(200).json({
        status: "success",
        token,
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  },
  logout: async (req, res) => {
    try {
      const id = req.userId;
      await User.update({ token: null }, { where: { id } });
      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  },
};
