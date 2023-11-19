const {
  registerUser,
  checkEmailIsValide,
  resetPassword,
} = require("../controllers/auth");

const router = require("express").Router();
router.post("/register", registerUser);
router.post("/verification/email", checkEmailIsValide);
router.post("/init/password", resetPassword);
module.exports = router;
