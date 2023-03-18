const Joi = require("@hapi/joi");

module.exports = {
  signupSchema: Joi.object({
    nama: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    instansi: Joi.string().optional(),
    jabatan: Joi.string().optional(),
    nip: Joi.string().optional(),
    password: Joi.string().min(6).required(),
  }),
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  categorySchema: Joi.object({
    nama: Joi.string().required(),
    deskripsi: Joi.string().required(),
  }),
  submitNilai: Joi.object({
    siswaId: Joi.number().required(),
    nilai: Joi.number().required(),
    categoryId: Joi.number().required(),
  }),
  createSoal: Joi.object({
    soal: Joi.string().required(),
    score: Joi.number().required(),
    category_id: Joi.number().required(),
  }),
  updateSoal: Joi.object({
    id: Joi.number().required(),
    soal: Joi.string().optional(),
    score: Joi.number().optional(),
    category_id: Joi.number().optional(),
  }),
  updateProfileSchema: Joi.object({
    nama: Joi.string().optional(),
    nip: Joi.string().optional(),
    username: Joi.string().optional(),
    instansi: Joi.string().optional(),
  }),
  createSiswa: Joi.object({
    nama: Joi.string().required(),
    nomorAbsen: Joi.number().required(),
    nomorInduk: Joi.string().required(),
    kelas: Joi.string().required(),
  }),
  updateSiswa: Joi.object({
    nama: Joi.string().optional(),
    nomorAbsen: Joi.number().optional(),
    nomorInduk: Joi.string().optional(),
    kelas: Joi.string().optional(),
  }),
  updateProfile: Joi.object({
    nama: Joi.string().min(3).optional(),
    instansi: Joi.string().optional(),
    jabatan: Joi.string().optional(),
    nip: Joi.string().optional(),
    password: Joi.string().min(6).optional(),
  }),
  updateCategory: Joi.object({
    nama: Joi.string().optional(),
    deskripsi: Joi.string().optional(),
  }),
};
