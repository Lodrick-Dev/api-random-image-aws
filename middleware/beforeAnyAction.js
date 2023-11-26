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
    const user = req.user;
    //check if email vérified
    // console.log(user);
    if (!user.email_verified)
      return res
        .status(200)
        .json({ message: "Erreur: Veuillez vérifier votre mail" });
    //vérification si autorisé 👇
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
    const user = req.user;
    console.log("log ici bro");
    console.log(user);
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
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { pseudo, email, password } = req.body;
  if (!pseudo || !email || !password)
    return res
      .status(200)
      .json({ message: "Erreur : Les champs sont obligatoires" });

  if (pseudo.length < 3)
    return res
      .status(200)
      .json({ message: "Erreur : Pseudo trop court, min 3 caractères" });

  if (password.length < 7)
    return res
      .status(200)
      .json({ message: "Erreur: Mot de passe trop court, min 7 caractères" });

  if (!emailregex.test(email))
    return res
      .status(200)
      .json({ message: "Erreur : E-Mail n'est pas valide" });

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
