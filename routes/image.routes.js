const router = require("express").Router();
const multer = require("multer");
const {
  uploadImg,
  deleteImg,
  getOneRandom,
  getAll,
  reactionUserOnImage,
} = require("../controllers/image.aws");
const {
  checkTokenAndAllow,
  checkTokenPublic,
} = require("../middleware/beforeAnyAction");

const fileFilterImg = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Format non autorisé"), false);
  }
};

//si on veut pas stocker dans le serveur
const storageNot = multer.memoryStorage(); // Utilise la mémoire pour stocker les fichiers temporairement

const uploadNoStock = multer({
  storage: storageNot,
  fileFilter: fileFilterImg,
});
//fin traitementn image

//middle a mettre avant les focntion principal
router.post(
  "/admin/upload/image",
  uploadNoStock.single("imageaws"),
  checkTokenAndAllow,
  uploadImg
);

//ici aussi y a doit avoir des middleware
router.delete("/admin/delete/image", checkTokenAndAllow, deleteImg);
//ici aussi middleware
router.get("/admin/all/images", checkTokenAndAllow, getAll);

// call on piece random - PUBLIC
router.get("/random/image", getOneRandom);
//action like REACTION - PUBLIC -- check if connecté (middleware)
router.put("/react/image", checkTokenPublic, reactionUserOnImage);

module.exports = router;
