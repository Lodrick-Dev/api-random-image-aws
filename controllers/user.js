const adminFirebaseInit = require("../middleware/firebase");
const UserModel = require("../models/user.model");

//get /user oneUser check in firebase then in mongo DB
module.exports.getUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(200).json({ message: "Erreur : Id inconnu" });
  try {
    const userRecord = await adminFirebaseInit.auth().getUser(id);
    console.log(userRecord.email);
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
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(200).json({ message: error.message });
  }
};

//put /update/:id check in firebase then in mongoDb
module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { pseudo } = req.body;
  if (!id || !pseudo)
    return res.status(200).json({
      message: "Erreur : L'identification de l'utilisateur n'a pas réussie",
    });
  try {
    const userCurrent = await adminFirebaseInit.auth().getUser(id);
    if (!userCurrent)
      return res
        .status(200)
        .json({ message: "Erreur : Utilisateur non trouvé" });

    //on vérifie si le nom exist normal :
    const checkIfPseudoExist = await UserModel.findOne({ pseudo: pseudo });
    if (checkIfPseudoExist) {
      return res
        .status(200)
        .json({ message: `Erreur : le pseudo " ${pseudo} " existe déjà` });
    }
    //on vréifie avec la première lettre
    const lettreFirstCapital = pseudo.charAt(0).toUpperCase() + pseudo.slice(1);
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
};

//get /email get user by email to ADMIN
module.exports.getUserByEmailSend = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(200).json({ message: "Champs obligatoire" });
  try {
    const userRecord = await adminFirebaseInit.auth().getUserByEmail(email);
    return res.status(200).send(userRecord);
  } catch (error) {
    console.log("====================================");
    console.log();
    console.log("====================================");
    return res.status(200).json({ message: error.message });
  }
};

//get /all alluser to ADMIN
module.exports.getAllUsers = async (req, res) => {
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
