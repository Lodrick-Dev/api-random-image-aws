const {
  getUserId,
  deleteUser,
  getAllUsers,
  getUserByEmailSend,
  updateUser,
  deleteUserCurrent,
  findUserMongo,
} = require("../controllers/user");
const {
  checkTokenAndAllow,
  checkTokenPublic,
} = require("../middleware/beforeAnyAction");

//un middle qui vérifie si token identifie un user admin
const router = require("express").Router();
router.get("/one/:id", getUserId); //firebase to send data from mongo to user connect current
router.get("/find/user/:id", checkTokenPublic, findUserMongo);
router.put("/update/:id", updateUser); //un middleware avec le token ici
router.post("/email", checkTokenAndAllow, getUserByEmailSend);
router.get("/all", checkTokenAndAllow, getAllUsers);
router.delete("/delete", checkTokenAndAllow, deleteUser);
router.delete("/current/delete", deleteUserCurrent); //un middleware avec le token ici

module.exports = router;
