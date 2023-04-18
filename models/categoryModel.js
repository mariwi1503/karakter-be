const { Sequelize } = require("sequelize");
const db = require("../db");

const Category = db.define(
  "category",
  {
    nama: { type: Sequelize.STRING, allowNull: false },
    deskripsi: { type: Sequelize.STRING },
    gambar: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
    // underscored: true
  }
);

module.exports = Category;
