"use strict";

const Category = require("../models/categoryModel");
const validation = require("../libraries/JoiLib");

module.exports = {
  getAll: async (req, res) => {
    try {
      const allCategory = await Category.findAll();
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
      const category = await Category.findOne({ where: { id } });
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
      const category = await Category.findOne({ where: { id } });
      if (!category) throw new Error("Kategori tidak ditemukan");

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
      const category = await Category.findOne({ where: { id } });
      if (!category) throw new Error("Kategori tidak ditemukan");

      await category.update({ where: { id }, payload });
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
