const {
  getUserId,
  deleteUser,
  getAllUsers,
  getUserByEmailSend,
} = require("../controllers/user");
const { checkTokenAndAllow } = require("../middleware/beforeAnyAction");

//un middle qui vérifie si token identifie un user admin
const router = require("express").Router();
router.get("/one/:id", getUserId); //firebase to send data from mongo
router.post("/email", checkTokenAndAllow, getUserByEmailSend);
router.get("/all", checkTokenAndAllow, getAllUsers);
router.delete("/delete", checkTokenAndAllow, deleteUser);

module.exports = router;
