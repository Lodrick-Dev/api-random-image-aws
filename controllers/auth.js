const sendCustomVerificationEmail = require("../middleware/bodyEmailToCheck");
const sendCustomPasswordResetEmail = require("../middleware/bodyEmailToPasswordInit");
const adminFirebaseInit = require("../middleware/firebase");

//resgiter post FIREBASE ADMIN
module.exports.registerUserAdmin = async (req, res, next) => {
  const { pseudo, email, password } = req.body;
  try {
    await adminFirebaseInit
      .auth()
      .createUser({
        email: email,
        password: password,
        displayName: pseudo,
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
    return res
      .status(200)
      .json({ message: "Erreur avec l'email bro : " + error.message });
    console.log("====================================");
  }
};

//post register PUBLIC -FIREBASE
module.exports.registerUserPublic = async (req, res, next) => {
  const { pseudo, email } = req.body;
  try {
    await adminFirebaseInit
      .auth()
      .createUser({
        email: email,
        password: password,
        displayName: pseudo,
      })
      .then((userRecord) => {
        console.log(`Succès create user : ${userRecord.uid}`);
        return res
          .status(200)
          .json({ message: `Nouvel utilisateur créé, connectez-vous` });
      });
  } catch (error) {
    //email not valid / password too short / email exist
    return res
      .status(200)
      .json({
        message:
          "Erreur bro : Erreur critique au niveau de Firebase" + error.message,
      });
  }
};
