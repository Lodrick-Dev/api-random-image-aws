const sendCustomVerificationEmail = require("../middleware/bodyEmailToCheck");
const sendCustomPasswordResetEmail = require("../middleware/bodyEmailToPasswordInit");
const adminFirebaseInit = require("../middleware/firebase");

//resgiter post firebase
module.exports.registerUser = async (req, res) => {
  const { email, password, code } = req.body;
  if (!email || !password || !code)
    return res
      .status(200)
      .json({ message: "Erreur : Bro les champs sont obligatoire" });

  if (code !== process.env.CODE_ACCESS)
    return res
      .status(200)
      .json({ message: "Erreur : Bro le code d'accès est incorrect" });
  try {
    await adminFirebaseInit
      .auth()
      .createUser({
        email: email,
        password: password,
        displayName: "Marc Doe",
      })
      .then((userRecord) => {
        console.log(`Succès create user : ${userRecord.uid}`);
        return res
          .status(200)
          .json({ message: `Nouvel utilisateur créé, connectez-vous` });
      });
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
    console.log("====================================");
    console.log(error);
    res.status(200).json({ message: "Erreur bro : " + error.message });
    console.log("====================================");
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
    return res.status(200).json({ message: "Erreur bro : " + error.message });
    console.log("====================================");
  }
};
