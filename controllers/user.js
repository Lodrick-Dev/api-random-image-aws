const adminFirebaseInit = require("../middleware/firebase");

//get /user oneUser
module.exports.getUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(200).json({ message: "Id inconnu" });
  try {
    await adminFirebaseInit
      .auth()
      .getUser(id)
      .then((userRecord) => {
        return res.status(200).send(userRecord);
      });
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
    await adminFirebaseInit
      .auth()
      .getUserByEmail(email)
      .then((userRecord) => {
        return res.status(200).send(userRecord);
      });
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

//delete /delete
module.exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(200).json({ message: `Un id est nécessaire` });
  try {
    await adminFirebaseInit
      .auth()
      .deleteUser(id)
      .then(() => {
        return res.status(200).json({ message: `${id} supprimé avec succè` });
      });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(200).json({ message: error.message });
  }
};

//post /confirmationUser (before delete); NOTE USE
module.exports.confirmationUser = async (req, res) => {};
