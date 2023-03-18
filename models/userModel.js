const { Sequelize } = require("sequelize");
const db = require("../db");

const User = db.define(
  "user",
  {
    nama: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    nip: { type: Sequelize.STRING },
    instansi: { type: Sequelize.STRING },
    jabatan: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING, allowNull: false },
    role: { type: Sequelize.STRING, defaultValue: "user" },
    token: { type: Sequelize.STRING, defaultValue: null },
  },
  {
    freezeTableName: true,
    // underscored: true
  }
);

module.exports = User;
