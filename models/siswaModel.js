const { Sequelize } = require("sequelize");
const db = require("../db");

const Siswa = db.define(
  "siswa",
  {
    nama: { type: Sequelize.STRING, allowNull: false },
    nomorInduk: { type: Sequelize.STRING, allowNull: false },
    nomorAbsen: { type: Sequelize.INTEGER, allowNull: false },
    kelas: { type: Sequelize.STRING, allowNull: false },
  },
  {
    freezeTableName: true,
    // underscored: true,
  }
);

module.exports = Siswa;
