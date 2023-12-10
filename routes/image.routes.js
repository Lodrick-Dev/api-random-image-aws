const router = require("express").Router();
const multer = require("multer");
const {
  uploadImg,
  deleteImg,
  getOneRandom,
  getAll,
  getOneImageMongo,
  reactionUserOnImageSaveInMongo,
  commentImage,
  deleteMyCommentaire,
} = require("../controllers/image.aws");
const {
  checkTokenAndAllow,
  checkTokenPublic,
} = require("../middleware/beforeAnyAction");
const { sendNewreaction } = require("../utils/initWebSocketServer");

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
router.get("/admin/all/images", getAll);

// call on piece random - PUBLIC AWS / NOT USE
router.get("/random/image", getOneRandom);
//call on piece random - to PUBLIC from MONGO
router.get("/random/one/image/:id?", getOneImageMongo);
//action like REACTION - PUBLIC -- check if connecté (middleware)
router.put("/react/image", checkTokenPublic, reactionUserOnImageSaveInMongo);
router.delete("/comment/delete", checkTokenPublic, deleteMyCommentaire);
router.put("/comment/image", checkTokenPublic, commentImage);

module.exports = router;
