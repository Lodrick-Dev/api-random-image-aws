const {
  registerUserAdmin,
  checkEmailIsValide,
  resetPassword,
  registerUserPublic,
} = require("../controllers/auth");
const {
  checkInDataBaseBeforeRegister,
  checkInDataBaseBeforeRegisterPublic,
} = require("../middleware/beforeAnyAction");

const router = require("express").Router();
router.post("/register", checkInDataBaseBeforeRegister, registerUserAdmin);
router.post(
  "/pub/register",
  checkInDataBaseBeforeRegisterPublic,
  registerUserPublic
);
router.post("/verification/email", checkEmailIsValide);
router.post("/init/password", resetPassword);
module.exports = router;
