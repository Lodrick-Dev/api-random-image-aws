const nodemailer = require("nodemailer");

// Configuration du transporteur
module.exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_MAIL,
    pass: process.env.GMAIL_PASS,
  },
});
