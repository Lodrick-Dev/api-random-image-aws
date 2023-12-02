const sendCustomVerificationEmail = require("../middleware/bodyEmailToCheck");
const sendCustomPasswordResetEmail = require("../middleware/bodyEmailToPasswordInit");
const adminFirebaseInit = require("../middleware/firebase");
const { transporter } = require("../middleware/nodemail");
const { Resend } = require("resend");
// console.log(Resend);
const resend = new Resend(process.env.RESEND_API_KEY);

//resgiter post FIREBASE ADMIN
module.exports.registerUserAdmin = async (req, res, next) => {
  const { hidden, pseudo, email, password } = req.body;
  if (hidden) {
    // const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.GMAIL_MAIL,
      subject: "Alert bot",
      text: `Alert faut sécurisé, un bot traine ici - espace Admin pour snap-boum, le pseudo : ${pseudo} et le mail : ${email} et le mot de passe : ${password}`,
    });
    ///avec nodemail et gmail 👇
    // const optionMail = {
    //   from: process.env.GMAIL_MAIL,
    //   to: process.env.GMAIL_MAIL,
    //   subject: "Alert bot",
    //   text: ` Frère faut sécurisé ça, un bot traine ici - espace admin `,
    // };
    // transporter.sendMail(optionMail, (error, info) => {
    //   if (error) return res.status(200).send(error);
    //   return res.status(200).json({ message: "Message envoyé" });
    // });
    ///avec nodemail et gmail 👆
    return res.status(200).json({ message: "Erreur : Hello bot" });
  }
  try {
    await adminFirebaseInit.auth().createUser({
      email: email,
      password: password,
      displayName: pseudo,
    });

    ///avec nodemail et gmail 👇
    // const optionMailRegister = {
    //   from: process.env.GMAIL_MAIL,
    //   to: process.env.GMAIL_MAIL,
    //   subject: "Espace admin de Snap Boum",
    //   text: `Nouvel inscription d'un admin ${pseudo} avec le mail : ${email}`,
    // };
    // transporter.sendMail(optionMailRegister, (error, info) => {
    //   if (error) res.status(200).send(error);
    // });
    ///avec nodemail et gmail 👆

    console.log("user create success");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.GMAIL_MAIL,
      subject: "Espace admin de Snap Boum",
      text: `Nouvel inscription d'un admin ${pseudo} avec le mail : ${email}`,
    });
    return res
      .status(200)
      .json({ message: `Nouvel Admin créé, connectez-vous` });
  } catch (error) {
    //email not valid / password too short / email exist
    return res.status(200).json({ message: "Erreur bro : " + error.message });
  }
};

//post verification Email
module.exports.checkEmailIsValide = async (req, res) => {
  const { email, displayName } = req.body;
  if (!email || !displayName)
    return res
      .status(200)
      .json({ message: "Champs obligatoire pour la vérification" });
  try {
    await adminFirebaseInit
      .auth()
      .generateEmailVerificationLink(email)
      .then((link) => {
        return sendCustomVerificationEmail(email, displayName, link, res);
      });
  } catch (error) {
    console.log("===============error=====================");
    console.log(error);
    res.status(200).json({ message: "Erreur bro : " + error.message });
    console.log("===================error=================");
  }
};

//post init password
module.exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await adminFirebaseInit
      .auth()
      .generatePasswordResetLink(email)
      .then((link) => {
        return sendCustomPasswordResetEmail(email, link, res);
      });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    return res
      .status(200)
      .json({ message: "Erreur avec l'email bro : " + error.message });
    console.log("====================================");
  }
};

//post register PUBLIC -FIREBASE
module.exports.registerUserPublic = async (req, res, next) => {
  const { hidden, pseudo, email, password } = req.body;
  if (hidden) {
    //avec nodemail et gmail 👇
    // const optionMailBotPublic = {
    //   from: process.env.GMAIL_MAIL,
    //   to: process.env.GMAIL_MAIL,
    //   subject: "Alert bot",
    //   text: ` Frère faut sécurisé ça, un bot traine ici sur le snap-boum espace public`,
    // };
    // transporter.sendMail(optionMailBotPublic, (error, info) => {
    //   if (error) return res.status(200).send(error);
    //   return res.status(200).json({ message: "Message envoyé" });
    // });
    //avec nodemail et gmail 👆
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.GMAIL_MAIL,
      subject: "Snap Boum - Espace public",
      text: `Alert faut sécurisé, un bot traine ici - public pour snap-boum`,
    });
    return res.status(200).json({ message: "Erreur : Hello bot" });
  }
  try {
    await adminFirebaseInit.auth().createUser({
      email: email,
      password: password,
      displayName: pseudo,
    });
    console.log(`Succès create user `);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.GMAIL_MAIL,
      subject: "Espace Public de Snap Boum",
      text: `Nouvel inscription sur Snap Boum , l'utilisateur ${pseudo} avec le mail : ${email}`,
    });
    // const optionMailRegisterPublic = {
    //   from: process.env.GMAIL_MAIL,
    //   to: process.env.GMAIL_MAIL,
    //   subject: "Espace Public de Snap Boum",
    //   text: `Nouvel inscription sur Snap Boum ${pseudo} avec le mail : ${email}`,
    // };
    // transporter.sendMail(optionMailRegisterPublic, (error, info) => {
    //   if (error) console.log(error);
    // });
    return res
      .status(200)
      .json({ message: `Nouvel utilisateur créé, connectez-vous` });
  } catch (error) {
    //email not valid / password too short / email exist
    console.log(error);
    return res.status(200).json({
      message:
        "Erreur bro : Erreur critique au niveau de Firebase" + error.message,
    });
  }
};
