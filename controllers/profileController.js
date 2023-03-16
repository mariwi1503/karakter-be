"use strict";

const { User } = require("../models");
const validation = require("../libraries/JoiLib");
const bcrypt = require("../libraries/bcryptLib");

module.exports = {
  get: async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json({
        status: "success",
        data: user ?? null,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.userId;
      const payload = await validation.updateProfile.validateAsync(req.body);
      let { nama, instansi, jabatan, nip, password } = payload;

      const user = req.user;
      if (!user) throw new Error("Profil anda tidak ditemukan");

      let data = {};
      if (nama) data.nama = nama;
      if (instansi) data.instansi = instansi;
      if (jabatan) data.jabatan = jabatan;
      if (nip) data.nip = nip;
      if (password) data.password = bcrypt.hasher(password);

      await User.update(data, { where: { id } });
      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
};
