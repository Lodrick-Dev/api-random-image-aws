const { transporter } = require("./nodemail");

function sendCustomPasswordResetEmail(email, link, res) {
  const mailOptions = {
    from: process.env.GMAIL_MAIL,
    to: email,
    subject: "Mise à jour de votre mot de passe",
    text: `Bonjour ! Cliquez sur le lien suivant pour modifier votre mot de passe: ${link}`,
    replyTo: "noreply@snap-boum.com",
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

module.exports = sendCustomPasswordResetEmail;
