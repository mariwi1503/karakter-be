"use strict";

const { User } = require("../models"),
  bcrypt = require("../libraries/bcryptLib"),
  jwtLib = require("../libraries/jwtLib"),
  validation = require("../libraries/JoiLib"),
  sendEmail = require("../helper/sendEmail"),
  crypto = require("crypto");

module.exports = {
  signup: async (req, res) => {
    try {
      const payload = await validation.signupSchema.validateAsync(req.body);
      let {
        nama,
        email,
        jabatan = null,
        nip = null,
        password,
        instansi = null,
      } = payload;

      email = email.toLowerCase(); // set email to lowercase
      const userExist = await User.findOne({ where: { email } });
      if (userExist) throw new Error("Email sudah digunakan");

      password = bcrypt.hasher(password);

      await User.create({
        nama,
        email,
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
      let { email, password } = payload;
      email = email.toLowerCase(); // set email to lower case

      // user exist check
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("Email belum terdaftar");

      // validate password
      const passwordMatch = bcrypt.checker(password, user.password);
      if (!passwordMatch) throw new Error("Password anda salah");

      // generate token
      const token = jwtLib.generate({
        id: user.id,
      });

      await User.update({ token }, { where: { email } });
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
  forgotPassword: async (req, res) => {
    try {
      let { email } = req.body;
      email = email.toLowerCase();
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("Akun tidak ditemukan");
      }

      const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const randomBytes = crypto.randomBytes(6);
      const passwordArr = Array.from(randomBytes).map(
        (byte) => characters[byte % characters.length]
      );

      const newPassword = passwordArr.join("");
      const password = bcrypt.hasher(newPassword);
      await User.update({ password }, { where: { id: user.id } });

      await sendEmail(
        email,
        `Halo ${user.nama}, berikut adalah password baru anda: \n ${newPassword}. \n Perbaharuilah password anda secara berkala`
      );

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
