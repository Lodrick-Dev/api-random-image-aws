const {
  getUserId,
  deleteUser,
  getAllUsers,
  getUserByEmailSend,
  updateUser,
  deleteUserCurrent,
  findUserMongo,
  getAllUsersFromFireBase,
  getUserByEmailFromMongo,
} = require("../controllers/user");
const {
  checkTokenAndAllow,
  checkTokenPublic,
} = require("../middleware/beforeAnyAction");

//un middle qui vérifie si token identifie un user admin
const router = require("express").Router();
router.get("/one/:id", getUserId); //firebase to send data from mongo to user connect current
router.get("/find/user/:id", checkTokenPublic, findUserMongo); //in mongo
router.put("/update/:id", updateUser); //un middleware avec le token ici
router.post("/email", checkTokenAndAllow, getUserByEmailSend); //firebase
router.get("/all", checkTokenAndAllow, getAllUsersFromFireBase);
router.get("/email/mongo", checkTokenAndAllow, getUserByEmailFromMongo); // in mongo
// router.get("/email/mongo", getUserByEmailFromMongo); // in mongo
router.delete("/delete", checkTokenAndAllow, deleteUser);
router.delete("/current/delete", checkTokenPublic, deleteUserCurrent); //un middleware avec le token ici

module.exports = router;
