const adminFirebaseInit = require("../middleware/firebase");
const UserModel = require("../models/user.model");

//get /user oneUser check in firebase then in mongo DB
module.exports.getUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(200).json({ message: "Id inconnu" });
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

//get /email get user by email
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

//get /all alluser
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

//delete /delete mongo - firebase
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
