"use strict";

const Category = require("../models/categoryModel");
const validation = require("../libraries/JoiLib");
const { Soal } = require("../models");

module.exports = {
  getAll: async (req, res) => {
    try {
      const allCategory = await Category.findAll({
        attributes: ["id", "nama", "deskripsi"],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        status: "success",
        data: allCategory,
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
      const category = await Category.findOne({
        where: { id },
        include: [{ model: Soal, attributes: ["soal", "score"] }],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!category) throw new Error("Category tidak ditemukan");

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const payload = await validation.categorySchema.validateAsync(req.body);
      const { nama, deskripsi } = payload;
      await Category.create({
        nama,
        deskripsi,
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

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({
        where: { id },
        include: [{ model: Soal }],
      });
      if (!category) throw new Error("Kategori tidak ditemukan");
      if (category.dataValues.soals && category.dataValues.soals.length > 0) {
        throw new Error("Kategori ini memiliki beberapa soal");
      }

      await category.destroy({ where: { id } });
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

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const payload = await validation.updateCategory.validateAsync(req.body);
      const category = await Category.findOne({
        where: { id },
      });
      if (!category) throw new Error("Kategori tidak ditemukan");

      await category.update(payload, { where: { id } });
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
};
