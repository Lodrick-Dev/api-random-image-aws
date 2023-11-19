const {
  deleteImgAws,
  uploadImgAws,
  getItemRandom,
  getAllImages,
} = require("../utils/aws.storage");

//uplaod image
module.exports.uploadImg = async (req, res) => {
  console.log("====================================");
  console.log(req.file);
  console.log("====================================");
  if (!req.file) {
    return res
      .status(200)
      .json({ message: "Erreur: Aucune image selectionnée" });
  }
  try {
    await uploadImgAws(req.file);
    return res.status(200).json({ message: "Image envoyé avec succès" });
  } catch (error) {
    console.log("Ici upload du s3");
    console.log(error);
    return res
      .status(200)
      .json({ message: "Erreur lors de l'envoie de l'image" });
  }
};

//delete image
module.exports.deleteImg = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(200).json({ message: `Le nom est introuvable` });
  try {
    await deleteImgAws(name);
    return res.status(200).json({ message: "Image supprimée avec succès" });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(200).json({ message: "Error frère" });
  }
};

//get all images
module.exports.getAll = async (req, res) => {
  try {
    await getAllImages(res);
  } catch (error) {
    console.log("====Error ici pour le all===============");
    console.log(error);
    console.log("====================================");
  }
};

//get random
module.exports.getOneRandom = async (req, res) => {
  try {
    const img = await getItemRandom(res);
  } catch (error) {
    console.log("=====dans get on random controller=======");
    console.log(error);
    console.log("====================================");
  }
};
