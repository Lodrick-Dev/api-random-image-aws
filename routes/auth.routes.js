const {
  registerUser,
  checkEmailIsValide,
  resetPassword,
} = require("../controllers/auth");
const {
  checkInDataBaseBeforeRegister,
} = require("../middleware/beforeAnyAction");

const router = require("express").Router();
router.post("/register", checkInDataBaseBeforeRegister, registerUser);
router.post("/verification/email", checkEmailIsValide);
router.post("/init/password", resetPassword);
module.exports = router;
