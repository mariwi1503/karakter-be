"use strict";

const { Siswa, Nilai, User } = require("../models");
const validation = require("../libraries/JoiLib");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  create: async (req, res) => {
    try {
      const payload = await validation.createSiswa.validateAsync(req.body);
      const userId = req.userId;
      const { nama, nomorAbsen, nomorInduk, kelas } = payload;
      const [siswa, created] = await Siswa.findOrCreate({
        where: {
          [Op.and]: [{ userId }, { nomorInduk }],
        },
        defaults: {
          nama,
          nomorAbsen,
          userId,
          kelas,
          nomorInduk,
        },
      });
      if (!created)
        throw new Error(
          `Anda sudah mendaftarkan siswa dengan NIS: ${nomorInduk} dengan nama ${siswa.nama}`
        );

      res.status(201).json({
        status: "success",
        data: { id: siswa.id },
      });
    } catch (error) {
      console.log("🚀 ~ create: ~ error:", error);
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      let { page = 1, limit = 5, search, kelas } = req.query;
      const userId = req.userId;
      let data;
      if (search && kelas) {
        data = await Siswa.findAll({
          where: {
            [Op.and]: [
              {
                userId,
              },
              {
                kelas,
              },
              {
                [Op.or]: [
                  {
                    nama_siswa: {
                      [Op.iLike]: `%${search}%`,
                    },
                  },
                  {
                    nomor_induk: {
                      [Op.iLike]: `%${search}%`,
                    },
                  },
                ],
              },
            ],
          },
          attributes: { exclude: ["userId"] },
          order: [["nama", "ASC"]],
        });
      } else if (search) {
        data = await Siswa.findAll({
          where: {
            [Op.and]: [
              {
                userId,
              },
              {
                [Op.or]: [
                  {
                    nama_siswa: {
                      [Op.iLike]: `%${search}%`,
                    },
                  },
                  {
                    nomor_induk: {
                      [Op.iLike]: `%${search}%`,
                    },
                  },
                ],
              },
            ],
          },
        });
      } else if (kelas) {
        page = parseInt(page);
        limit = parseInt(limit);
        let offset = (page - 1) * limit;
        data = await Siswa.findAndCountAll({
          where: {
            [Op.and]: [
              {
                userId,
              },
              {
                kelas,
              },
            ],
          },
          limit,
          offset,
          attributes: { exclude: ["userId"] },
          order: [["nama", "ASC"]],
        });
        if (offset > 0) {
          data.prev_page = page - 1;
        }
        if (page * limit < data.count) {
          data.next_page = page + 1;
        }
      } else {
        page = parseInt(page);
        limit = parseInt(limit);
        let offset = (page - 1) * limit;
        data = await Siswa.findAndCountAll({
          where: { userId },
          limit,
          offset,
          attributes: { exclude: ["userId"] },
          order: [
            ["kelas", "ASC"],
            ["nama", "ASC"],
          ],
        });
        if (offset > 0) {
          data.prev_page = page - 1;
        }
        if (page * limit < data.count) {
          data.next_page = page + 1;
        }
      }
      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  getOne: async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.userId;
      const siswa = await Siswa.findOne({
        where: { id },
        include: [{ model: Nilai }],
        attributes: { exclude: ["userId"] },
      });
      if (siswa && siswa.userId != userId) {
        throw new Error("Data siswa ini bukan milik anda");
      }

      res.status(200).json({
        status: "success",
        data: siswa ?? null,
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
      const payload = await validation.updateSiswa.validateAsync(req.body);
      const id = req.params.id;
      const userId = req.userId;
      const siswa = await Siswa.findOne({ where: { id } });
      if (!siswa) throw new Error("Data siswa tidak ditemukan");
      if (siswa.userId != userId) {
        throw new Error("Data siswa ini bukan milik anda");
      }

      if (payload.nomorInduk) {
        const dataExist = await Siswa.findOne({
          where: { nomorInduk: payload.nomorInduk },
        });
        if (dataExist)
          throw new Error(`Nomor induk ${payload.nomorInduk} sudah terdaftar`);
      }
      await Siswa.update(payload, {
        where: { id },
      });

      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      console.log("🚀 ~ update: ~ error:", error);
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.userId;
      const siswa = await Siswa.findOne({ where: { id } });
      if (!siswa) throw new Error("Data siswa tidak ditemukan");
      if (siswa.userId != userId) {
        throw new Error("Data siswa ini bukan milik anda");
      }

      await Siswa.destroy({ where: { id } });
      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  createFromExisting: async (req, res) => {
    try {
      const { nomorInduk } = req.body;
      const userId = req.userId;
      const [siswa] = await User.findAll({ where: { nomorInduk } });
      if (!siswa) throw new Error("Data tidak ditemukan");

      // create new siswa
      await Siswa.create({
        nama: siswa.nama,
        nomorAbsen: siswa.nomorAbsen,
        kelas: siswa.kelas,
        nomorInduk: siswa.nomorInduk,
        userId,
      });

      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
};
