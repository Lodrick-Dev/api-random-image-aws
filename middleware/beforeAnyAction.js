const adminFirebaseInit = require("./firebase");

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
