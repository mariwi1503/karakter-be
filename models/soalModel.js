const { Sequelize } = require("sequelize");
const db = require("../db");

const Soal = db.define(
  "soal",
  {
    soal: { type: Sequelize.STRING, allowNull: false },
    score: { type: Sequelize.INTEGER, allowNull: false },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Soal;
