const {
  getUserId,
  deleteUser,
  confirmationUser,
  getAllUsers,
  getUserByEmailSend,
} = require("../controllers/user");
const { checkTokenAndAllow } = require("../middleware/beforeAnyAction");

//un middle qui vérifie si token identifie un user admin
const router = require("express").Router();
router.get("/one/:id", getUserId);
router.post("/email", checkTokenAndAllow, getUserByEmailSend);
router.get("/all", checkTokenAndAllow, getAllUsers);
router.post("/confirmation", confirmationUser); //NOT USE
router.delete("/delete", checkTokenAndAllow, deleteUser);

module.exports = router;
