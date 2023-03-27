const { dbConfig } = require("../config");

const { Sequelize, DataType } = require("sequelize");

const db = new Sequelize({
  database: dbConfig.database,
  username: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: 5432,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialect: "postgres",
  logging: false, // mencegah log sequelize keluar di terminal
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Connection test
db.authenticate()
  .then(() => console.log("Database connected !"))
  .catch((err) => console.log("Connection failed: " + err));

// sinkronisasi database hanya diaktifkan ketika ada perubahan dan tambahan di folder model, setelah itu dikomen lagi
// db.sync({ force: false, alter: true });

module.exports = db;
