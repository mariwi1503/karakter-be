require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4000,
  dbConfig: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
  },
  jwtSecret: process.env.JWT_SECRET,
  mailConfig: {
    email: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  callbackToken: process.env.CB_TOKEN,
};
