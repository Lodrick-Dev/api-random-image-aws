const adminFirebaseInit = require("../middleware/firebase");
const UserModel = require("../models/user.model");

//get /user oneUser check in firebase then in mongo DB
module.exports.getUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(200).json({ message: "Erreur : Id inconnu" });
  try {
    const userRecord = await adminFirebaseInit.auth().getUser(id);
    // console.log(userRecord.email);
    if (!userRecord)
      return res
        .status(200)
        .json({ message: "Erreur : Utilisateur introuvable" });
    const userMongo = await UserModel.findOne({ email: userRecord.email });
    if (!userMongo)
      return res.status(200).json({
        message: "Erreur : Utilisateur introuvable dans notre base de donnée",
      });

    return res.status(200).send(userMongo);
  } catch (error) {
    console.log("================error====================");
    console.log(error);
    console.log("==================error==================");
    return res.status(200).json({ message: error.message });
  }
};

//get /user findUser in mongo with id
module.exports.findUserMongo = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(200)
      .json({ message: "Erreur: donnée manquante pour la recherche" });

  try {
    const userFind = await UserModel.findById(id).select(
      "-messages -email -reactionsimages"
    );
    if (!userFind)
      return res
        .status(200)
        .json({ message: "Erreur : Utilisateur non trouvé" });
    return res.status(200).send(userFind);
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "Erreur : lors de la tentative de recherche" });
  }
};

//put /update/:id check in firebase then in mongoDb
module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { pseudo, biographie, link } = req.body;
  let userCurrent;
  if (id) {
    try {
      userCurrent = await adminFirebaseInit.auth().getUser(id);
      if (!userCurrent)
        return res
          .status(200)
          .json({ message: "Erreur : Utilisateur non trouvé" });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "Une erreur est survenue" });
    }
  } else {
    return res.status(200).json({
      message: "Erreur : L'identification de l'utilisateur n'a pas réussie",
    });
  }

  //id trouvé on continue
  if (pseudo) {
    if (pseudo.length < 3)
      return res
        .status(200)
        .json({ message: "Erreur : Pseudo trop court, min 3 caractères" });
    if (pseudo.length > 15)
      return res
        .status(200)
        .json({ message: "Erreur : Pseudo trop long,max 15 caractères" });
    try {
      // const userCurrent = await adminFirebaseInit.auth().getUser(id);
      // if (!userCurrent)
      //   return res
      //     .status(200)
      //     .json({ message: "Erreur : Utilisateur non trouvé" });

      //on vérifie si le nom exist normal :
      const checkIfPseudoExist = await UserModel.findOne({ pseudo: pseudo });
      if (checkIfPseudoExist) {
        return res
          .status(200)
          .json({ message: `Erreur : le pseudo " ${pseudo} " existe déjà` });
      }
      //on vréifie avec la première lettre
      const lettreFirstCapital =
        pseudo.charAt(0).toUpperCase() + pseudo.slice(1);
      // console.log(lettreFirstCapital);
      const checkIfExisteFirstLettreCapital = await UserModel.findOne({
        pseudo: lettreFirstCapital,
      });
      if (checkIfExisteFirstLettreCapital)
        return res
          .status(200)
          .json({ message: `Erreur : ${pseudo} existe déjà 🤔` });

      //on vérifie avec minuscule
      const checkIfPseudoExistMin = await UserModel.findOne({
        pseudo: pseudo.toLowerCase(),
      });
      if (checkIfPseudoExistMin)
        return res
          .status(200)
          .json({ message: `Erreur : ${pseudo} existe déjà` });
      //on update
      const userMongoUpdate = await UserModel.updateOne(
        { email: userCurrent.email },
        { $set: { pseudo: pseudo } }
      );
      if (!userMongoUpdate)
        return res
          .status(200)
          .json({ message: "Erreur : Echec lors de la mise à jour du pseudo" });
      return res.status(200).send(userMongoUpdate);
    } catch (error) {
      console.log("==============IN erreor======================");
      console.log(error);
      console.log("====================================");
      return res.status(200).json({ message: error.message });
    }
  }

  //la bio
  //pour mettre aucune bio
  if (biographie === "0") {
    try {
      const userMongoEmptyBio = await UserModel.updateOne(
        {
          email: userCurrent.email,
        },
        { $set: { biographie: "" } }
      );
      if (!userMongoEmptyBio)
        return res
          .status(200)
          .json({ message: "Erreur , lors de la mise à jour sans biographie" });
      return res.status(200).send(userMongoEmptyBio);
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "Erreur, inattendue" });
    }
  }
  //pour mettre une bio
  if (biographie) {
    if (biographie.length > 110)
      return res
        .status(200)
        .json({ message: "Erreur: Nombre de cractères autorisés dépassé" });
    try {
      const userMongoUpdate = await UserModel.updateOne(
        { email: userCurrent.email },
        { $set: { biographie: biographie } }
      );
      if (!userMongoUpdate)
        return res.status(200).json({
          message: "Erreur : Echec lors de la mise à jour de la biographie",
        });
      return res.status(200).send(userMongoUpdate);
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        message: "Erreur : un erreur inattendue est survenue dans le serveur",
      });
    }
  }

  //pour enlever le lien
  if (link === "0") {
    try {
      const userMongoEmptyLink = await UserModel.updateOne(
        {
          email: userCurrent.email,
        },
        { $set: { link: "" } }
      );
      if (!userMongoEmptyLink)
        return res
          .status(200)
          .json({ message: "Erreur , lors de la mise à jour sans biographie" });
      return res.status(200).send(userMongoEmptyLink);
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "Erreur, inattendue" });
    }
  }
  //le lien
  if (link) {
    const regexLien = /^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?$/;
    if (regexLien.test(link)) {
      //lien correct continue
      try {
        const userMongoUpdate = await UserModel.updateOne(
          { email: userCurrent.email },
          { $set: { link: link } }
        );
        if (!userMongoUpdate)
          return res.status(200).json({
            message: "Erreur : Echec lors de la mise à jour de la biographie",
          });
        return res.status(200).send(userMongoUpdate);
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          message: "Erreur : un erreur inattendue est survenue dans le serveur",
        });
      }
    } else {
      return res.status(200).json({ message: "Erreur : Lien incorrect" });
    }
  }
};

//get find user by email in mongo
module.exports.getUserByEmailFromMongo = async (req, res) => {
  const { email } = req.query;
  if (!email)
    return res.status(200).json({ message: "Erreur: Email non trouvé" });
  try {
    const user = await UserModel.find({ email: email });
    if (user.length === 0) {
      return res
        .status(200)
        .json({ message: "Erreur : Utilisateur n'existe pas" });
    }
    if (user) return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Erreur: echec lors de la recherche " });
  }
};

//get /email get user by email to ADMIN - Firebase
module.exports.getUserByEmailSend = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(200).json({ message: "Champs obligatoire" });
  try {
    const userRecord = await adminFirebaseInit.auth().getUserByEmail(email);
    return res.status(200).send(userRecord);
  } catch (error) {
    console.log("====error get user by email================================");
    console.log(error);
    console.log("====================================");
    return res.status(200).json({ message: error.message });
  }
};

//get /all alluser to ADMIN to Firebase Base
module.exports.getAllUsersFromFireBase = async (req, res) => {
  const listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    adminFirebaseInit
      .auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        // Filtrer les informations sensibles et envoyer uniquement ce qui est nécessaire pour pas envoyé exemple le mdp
        const sanitizedUsers = listUsersResult.users.map((user) => {
          const {
            uid,
            displayName,
            email,
            emailVerified,
            metadata,
            providerData,
          } = user.toJSON();
          return {
            uid,
            displayName,
            email,
            emailVerified,
            metadata,
            providerData,
          };
        });

        return res.status(200).send({ users: sanitizedUsers });
        // listUsersResult.users.forEach((userRecord) => {
        //   console.log('user', userRecord.toJSON());
        // });
        // if (listUsersResult.pageToken) {
        //   // List next batch of users.
        //   listAllUsers(listUsersResult.pageToken);
        // }
      })
      .catch((error) => {
        console.log("Error listing users:", error);
      });
  };
  // Start listing users from the beginning, 1000 at a time.
  listAllUsers();
};

//delete /delete mongo - firebase TO ADMIN
module.exports.deleteUser = async (req, res) => {
  const { id, email } = req.body;
  if (!id || !email)
    return res.status(200).json({
      message: `Erreur : Un id et email nécessaires pour supprimer un utilisateur`,
    });
  try {
    const userMongo = await UserModel.findOne({ email: email });
    if (!userMongo)
      return res
        .status(200)
        .json({ message: "Erreur : Email non trouvé dans mongoDB" });

    //👇 temporaire
    // await adminFirebaseInit
    //   .auth()
    //   .deleteUser(id)
    //   .then(() => {
    //     return res.status(200).json({
    //       message: `Utilisateur : ${email} avec l'id : ${id} supprimé avec succès`,
    //     });
    //   });
    //👆 temporaire
    const deleteUserInAwsThenMongo = async () => {
      try {
        await adminFirebaseInit.auth().deleteUser(id);
        await userMongo.deleteOne().then(() => {
          return res.status(200).json({
            message: `Utilisateur : ${email} avec l'id : ${id} supprimé avec succès`,
          });
        });
      } catch (error) {
        console.log(error);
        return res
          .status(200)
          .json({ message: "Erreur : Erreur critique dans aws et mongo" });
      }
    };
    await deleteUserInAwsThenMongo();
  } catch (error) {
    console.log("==============firebas ou mongo======================");
    console.log(error);
    console.log("====================================");
    return res.status(200).json({ message: error.message });
  }
};

//delete /delete mongo and Firebase TO USER CURRENT (connecting)
module.exports.deleteUserCurrent = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(200).json({
      message: `Erreur : Les champs sont nécessaires pour supprimer votre compte`,
    });
  try {
    const userMongo = await UserModel.findOne({ email: email });
    if (!userMongo)
      return res.status(200).json({
        message:
          "Identification de l'utilisateur dans la base de donnée impossible",
      });
    await userMongo.deleteOne();
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log("On est la op");
    console.log(error);
  }
};
