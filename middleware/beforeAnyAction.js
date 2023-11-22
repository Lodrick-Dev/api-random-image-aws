const UserModel = require("../models/user.model");
const adminFirebaseInit = require("./firebase");

//ADMIN
module.exports.checkTokenAndAllow = async (req, res, next) => {
  const token = req.body.token || req.params.token || req.query.token;
  if (!token)
    return res.status(200).json({ message: "Erreur : Token obligatoire" });
  try {
    const decodedToken = await adminFirebaseInit.auth().verifyIdToken(token);
    // console.log("on est la ");
    //ceci nous permet de d'obtenir tous les infos de l'user
    // donc si on const {user} = req on aura le user
    req.user = decodedToken;
    //vérification si autorisé 👇
    const user = req.user;
    if (user.email !== process.env.EMAIL_ACCESS)
      return res.status(200).json({ message: "Erreur : Accès non autorisé" });
    next();
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("Token introuvable ou erreur");
    return res.status(200).json({ message: "Erreur bro: token incorrect" });
  }
};

//PUBLIC
module.exports.checkTokenPublic = async (req, res, next) => {
  const token = req.body.token || req.params.token || req.query.token;
  if (!token)
    return res
      .status(200)
      .json({ message: "Erreur : Token introuvable et obligatoire" });
  try {
    const decodedToken = await adminFirebaseInit.auth().verifyIdToken(token);
    // console.log("on est la ");
    //ceci nous permet de d'obtenir tous les infos de l'user
    // donc si on const {user} = req on aura le user
    req.user = decodedToken;
    //vérification si autorisé 👇
    next();
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("Token introuvable ou erreur");
    return res.status(200).json({ message: "Erreur bro: token incorrect" });
  }
};

module.exports.checkInDataBaseBeforeRegister = async (req, res, next) => {
  const { pseudo, email, password, code } = req.body;
  if (!pseudo || !email || !password || !code)
    return res
      .status(200)
      .json({ message: "Erreur : Bro les champs sont obligatoire" });

  if (password.length < 7)
    return res
      .status(200)
      .json({ message: "Erreur: Mot de passe trop court, min 7 caractères" });

  if (code !== process.env.CODE_ACCESS)
    return res
      .status(200)
      .json({ message: "Erreur : Bro le code d'accès est incorrect" });
  try {
    await UserModel.create({
      pseudo,
      email,
    });
    next();
  } catch (error) {
    if (error.keyValue.pseudo)
      return res.status(200).json({
        message: `Erreur : ${error.keyValue.pseudo} existe déjà`,
      });
    if (error.keyValue.email)
      return res
        .status(200)
        .json({ message: `Erreur : ${error.keyValue.email} existe déjà` });
    return res.status(200).json({ message: "Erreur: erreur inatendu" });
  }
};

module.exports.checkInDataBaseBeforeRegisterPublic = async (req, res, next) => {
  const { pseudo, email } = req.body;
  try {
    await UserModel.create({
      pseudo,
      email,
    });
    next();
  } catch (error) {
    if (error.keyValue.pseudo)
      return res.status(200).json({
        message: `Erreur : ${error.keyValue.pseudo} existe déjà`,
      });
    if (error.keyValue.email)
      return res
        .status(200)
        .json({ message: `Erreur : ${error.keyValue.email} existe déjà` });
    return res.status(200).json({ message: "Erreur: erreur inatendu" });
  }
};
