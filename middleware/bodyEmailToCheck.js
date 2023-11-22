const nodemailer = require("nodemailer");
const { transporter } = require("./nodemail");

function sendCustomVerificationEmail(
  userEmail,
  displayName,
  verificationLink,
  res
) {
  // Options de l'e-mail
  const mailOptions = {
    from: process.env.GMAIL_MAIL,
    to: userEmail,
    subject: "Vérification d'e-mail",
    text: `Bonjour ${displayName}! Cliquez sur le lien suivant pour vérifier votre adresse e-mail: ${verificationLink}`,
    replyTo: "noreply@snap-boum.fr",
  };

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
      throw error;
    } else {
      console.log("E-mail envoyé :", info.response);
      return res.status(200).json({ message: "Email envoyé avec succès" });
    }
  });
}

module.exports = sendCustomVerificationEmail;
