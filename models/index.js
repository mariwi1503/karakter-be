const User = require("./userModel");
const Nilai = require("./nilaiModel");
const Siswa = require("./siswaModel");
const Soal = require("./soalModel");
const Category = require("./categoryModel");

// table relation
User.hasMany(Nilai);
Nilai.belongsTo(User);

User.hasMany(Siswa);
Siswa.belongsTo(User);

Siswa.hasMany(Nilai);
Nilai.belongsTo(Siswa);

Category.hasMany(Nilai);
Nilai.belongsTo(Category);

Category.hasMany(Soal);
Soal.belongsTo(Category);

module.exports = {
  User,
  Nilai,
  Siswa,
  Category,
  Soal,
};
