const nodemailer = require("nodemailer"),
  { mailConfig } = require("../config");

module.exports = async (email, text) => {
  const msg = {
    from: "'Karakterku' <karakterku>",
    to: email,
    subject: "Password baru",
    text,
  };
  nodemailer
    .createTransport({
      service: "gmail",
      auth: {
        user: mailConfig.email,
        pass: "folxiyxwnoauteav",
      },
      port: 465,
      host: "smtp.ethereal.email",
    })
    .sendMail(msg, (err) => {
      if (err) throw new Error(err);
    });
};
