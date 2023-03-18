"use strict";

const validation = require("../libraries/JoiLib");
const { Soal, Category } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const payload = await validation.createSoal.validateAsync(req.body);
      const { soal, score, categoryId } = payload;
      await Soal.create({
        soal,
        score,
        categoryId,
      });

      res.status(201).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  //   getOne: async (req, res) => {
  //     try {
  //       const id = req.params.id;
  //       const soal = await Soal.findOne({ where: { id } });
  //       res.status(200).json({
  //         status: "success",
  //         data: soal ?? null,
  //       });
  //     } catch (error) {
  //       res.status(400).json({
  //         status: "failed",
  //         message: error.message,
  //       });
  //     }
  //   },
  getAll: async (req, res) => {
    try {
      const userId = req.userId;
      let { page, limit } = req.query;
      page = page ? parseInt(page) : 1;
      limit = limit ? parseInt(limit) : 7;
      let offset = (page - 1) * limit;
      const listSoal = await Soal.findAndCountAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "categoryId"],
        },
        include: [{ model: Category, attributes: ["id", "nama"] }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        status: "success",
        data: listSoal,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  getByCategory: async (req, res) => {
    try {
      const categoryId = req.params.categoryId;

      const listSoal = await Soal.findAll({
        where: { categoryId },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        status: "success",
        data: listSoal,
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
      // const id = req.params.id;
      const payload = await validation.updateSoal.validateAsync(req.body);
      //   const { soal, bobot, categoryId } = payload;
      const soalExist = await Soal.findOne({ where: { id: payload.id } });
      if (!soalExist) throw new Error("Soal tidak ditemukan");

      await Soal.update(payload, {
        where: { id: payload.id },
      });
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
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const soal = await Soal.findOne({ where: { id } });
      if (!soal) throw new Error("Soal tidak ditemukan");

      await Soal.destroy({ where: { id } });
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
