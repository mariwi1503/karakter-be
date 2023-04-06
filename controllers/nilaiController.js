"use strict";

const { Nilai, Siswa, Category, User } = require("../models");
const validation = require("../libraries/JoiLib");
const { Op, Sequelize } = require("sequelize");
const db = require("../db");
// const async = require('async')

const throwError = (code, message) => {
  res.status(code).json({ message });
};

module.exports = {
  submit: async (req, res) => {
    try {
      const payload = await validation.submitNilai.validateAsync(req.body);
      const userId = req.userId;
      const { siswaId, nilai, categoryId } = payload;

      // siswa check
      const siswa = await Siswa.findOne({ where: { id: siswaId } });
      if (!siswa) throw new Error("Siswa tidak ditemukan");

      // category check
      const category = await Category.findOne({ where: { id: categoryId } });
      if (!category) throw new Error("Categori tidak ditemukan");

      const [row, created] = await Nilai.findOrCreate({
        where: { siswaId, categoryId },
        defaults: {
          nilai,
          userId,
          siswaId,
          categoryId,
        },
      });
      if (!created) {
        await Nilai.update(
          {
            nilai,
          },
          { where: { id: row.id } }
        );
      }

      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      console.log("submit_nilai: ~ error:", error);
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  // menampilkan semua nilai siswa
  getAll: async (req, res) => {
    try {
      const userId = req.userId;
      let { page, limit, search, kelas } = req.query;
      let result;
      if (search && kelas) {
        result = await Siswa.findAll({
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
                    nama: {
                      [Op.iLike]: `%${search}%`,
                    },
                  },
                  {
                    nomorInduk: {
                      [Op.iLike]: `%${search}%`,
                    },
                  },
                ],
              },
            ],
          },
          attributes: { exclude: ["userId"] },
          include: [
            {
              model: Nilai,
              // required: true,
              attributes: {
                exclude: ["userId", "siswaId", "id", "categoryId"],
              },
              include: [
                {
                  model: Category,
                  attributes: ["id", "nama"],
                },
              ],
            },
          ],
          order: [["nama", "ASC"]],
        });
      } else if (search) {
        result = await Siswa.findAll({
          where: {
            [Op.and]: [
              {
                userId,
              },
              {
                [Op.or]: [
                  {
                    nama: {
                      [Op.iLike]: `%${search}%`,
                    },
                  },
                  {
                    nomorInduk: {
                      [Op.iLike]: `%${search}%`,
                    },
                  },
                ],
              },
            ],
          },
          attributes: { exclude: ["userId"] },
          include: [
            {
              model: Nilai,
              // required: true,
              attributes: {
                exclude: ["userId", "siswaId", "id", "categoryId"],
              },
              include: [
                {
                  model: Category,
                  attributes: ["id", "nama"],
                },
              ],
            },
          ],
        });
      } else if (kelas) {
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 5;
        let offset = (page - 1) * limit;
        offset = offset ?? 0; // avoid null or undefined value for offset
        result = await Siswa.findAndCountAll({
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
          include: [
            {
              model: Nilai,
              // required: true,
              attributes: {
                exclude: ["userId", "siswaId", "id", "categoryId"],
              },
              include: [
                {
                  model: Category,
                  attributes: ["id", "nama"],
                },
              ],
            },
          ],
          order: [["nama", "ASC"]],
        });

        // pagination setup
        result.totalPage = Math.ceil(result.count / limit);
        if (offset > 0) {
          result.prev_page = page - 1;
        }
        if (page * limit < result.count) {
          result.next_page = page + 1;
        }
        result.limit = limit;
      } else {
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 5;
        let offset = (page - 1) * limit;
        offset = offset ?? 0; // avoid null or undefined value for offset
        result = await Siswa.findAndCountAll({
          limit,
          offset,
          attributes: { exclude: ["userId"] },
          include: [
            {
              model: Nilai,
              // required: true,
              attributes: {
                exclude: ["userId", "siswaId", "id", "categoryId"],
              },
              include: [
                {
                  model: Category,
                  attributes: ["id", "nama"],
                },
              ],
            },
          ],
          where: {
            userId,
          },
          order: [
            ["kelas", "ASC"],
            ["nama", "ASC"],
          ],
        });

        // pagination setup
        result.totalPage = Math.ceil(result.count / limit);
        if (offset > 0) {
          result.prev_page = page - 1;
        }
        if (page * limit < result.count) {
          result.next_page = page + 1;
        }
        result.limit = limit;
      }

      res.status(200).json({
        status: "success",
        data: result,
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
      const userId = req.userId;
      const siswaId = req.params.siswaId;
      const nilai = await Nilai.findAll({
        where: {
          [Op.and]: [{ userId }, { siswaId }],
        },
        include: [{ model: Category, attributes: ["id", "nama"] }],
        attributes: {
          exclude: ["userId", "siswaId", "id", "categoryId"],
        },
      });
      res.status(200).json({
        status: "success",
        data: nilai,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  // public api for siswa
  siswaCheck: async (req, res) => {
    try {
      const { nomorInduk } = req.query;
      if (!nomorInduk)
        throw new Error("Silahkan masukkan nomor induk siswa kamu");

      const siswa = await Siswa.findAll({
        where: { nomorInduk },
        attributes: {
          exclude: ["userId", "kelas", "nomorAbsen", "nomorInduk"],
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "email",
                "instansi",
                "jabatan",
                "nip",
                "password",
                "token",
              ],
            },
          },
          {
            model: Nilai,
          },
        ],
        // include: [
        //   {
        //     model: Nilai,
        //     required: true,
        //     attributes: {
        //       exclude: [
        //         "createdAt",
        //         "updatedAt",
        //         "userId",
        //         "siswaId",
        //         "id",
        //         "categoryId",
        //       ],
        //     },
        //     include: [
        //       {
        //         model: Category,
        //         attributes: ["id", "nama"],
        //       },
        //     ],
        //   },
        //   {
        //     model: User,
        //     attributes: ["nama", "jabatan"],
        //   },
        // ],
      });
      if (!siswa)
        throw new Error(`Data untuk NIS:${nomorInduk} tidak ditemukan`);

      // const nilaiSiswa = await Nilai.findAll({
      //   where: { siswaId: siswa.id },
      // });

      res.status(200).json({
        status: "success",
        data: siswa,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
};

// result.rows = Object.values(
//   result.rows.reduce((data, item) => {
//     let key =
//       item.nomor_induk +
//       "-" +
//       item.nama_siswa +
//       "-" +
//       item.nomor_absen +
//       "-" +
//       item.kelas;
//     if (!data[key]) {
//       data[key] = {
//         nomor_induk: item.nomor_induk,
//         nama_siswa: item.nama_siswa,
//         nomor_absen: item.nomor_absen,
//         kelas: item.kelas,
//         nilai: [],
//       };
//     }
//     data[key].nilai.push({
//       category_id: item.category_id,
//       category_name: item.category.nama,
//       nilai: item.nilai,
//     });
//     return data;
//   }, {})
// );
// result.count = result.rows.length;
