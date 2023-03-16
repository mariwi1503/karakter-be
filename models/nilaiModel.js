const { Sequelize } = require("sequelize");
const db = require("../db");

const Nilai = db.define(
  "nilai",
  {
    nilai: { type: Sequelize.INTEGER, allowNull: false },
  },
  {
    freezeTableName: true,
    // underscored: true,
  }
);

module.exports = Nilai;
