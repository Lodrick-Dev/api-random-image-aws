const ImageModel = require("../models/image.model");
const {
  deleteImgAws,
  uploadImgAws,
  getItemRandom,
  getAllImages,
} = require("../utils/aws.storage");

//uplaod image
module.exports.uploadImg = async (req, res) => {
  console.log("====================================");
  // console.log(req.file);
  console.log("====================================");
  if (!req.file) {
    return res
      .status(200)
      .json({ message: "Erreur: Aucune image selectionnée" });
  }
  try {
    const beforeName = Date.now();
    const nameUnik = beforeName.toString();
    await uploadImgAws(req.file, nameUnik); //in aws
    //in mongoDb
    await ImageModel.create({
      nameimage: `https://image-random.s3.eu-west-3.amazonaws.com/api-random-img-${nameUnik}.jpg`,
    });
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
    const image = await ImageModel.findOne({ nameimage: name });
    if (!image)
      return res
        .status(200)
        .json({ message: "Erreur : Objet non trouvé dans la base de donnée" });
    const deleteInAwsAndDataBase = async () => {
      try {
        await deleteImgAws(name);
        await image.deleteOne();
        return res.status(200).json({ message: "Image supprimée avec succès" });
      } catch (error) {
        console.log(error);
      }
    };
    await deleteInAwsAndDataBase();
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

//put reaction - token nameimage emailuser react
module.exports.reactionUserOnImageSaveInMongo = async (req, res, next) => {
  const { idimgmongo, emailuser, react } = req.body;
  console.log(react);

  try {
    // Trouver l'image par ID
    const image = await ImageModel.findById(idimgmongo);

    // Vérifier si l'image existe
    if (!image) {
      return res
        .status(200)
        .json({ message: "Erreur : Identification de l'image impossible" });
    }

    // Vérifier si l'utilisateur a déjà réagi
    const userAlreadyReacted = image.reactionsusers.some(
      (reaction) => reaction.emailuser === emailuser
    );

    if (userAlreadyReacted) {
      // L'utilisateur a déjà réagi, mise à jour de sa réaction
      try {
        let updateQuery;
        if (react === "unlike") {
          // Si la réaction est "unlike", supprimer l'objet pour cet utilisateur
          updateQuery = { $pull: { reactionsusers: { emailuser } } };
          console.log("On retire");
        } else {
          // Si la réaction n'est pas "unlike", mettre à jour la réaction
          updateQuery = { $set: { "reactionsusers.$.reaction": react } };
          console.log("On ajoute");
        }
        await ImageModel.updateOne(
          { _id: image._id, "reactionsusers.emailuser": emailuser },
          updateQuery
          // { $set: { "reactionsusers.$.reaction": react } }
        );

        next();
        return res.status(200).json({ message: "ok" });
      } catch (error) {
        console.log(
          "Erreur lors de la mise à jour de la réaction de l'utilisateur : " +
            error
        );
        return res
          .status(200)
          .json({ message: "Erreur lors de la mise à jour de la reaction" });
      }
    } else {
      // L'utilisateur n'a pas encore réagi, ajouter sa réaction
      try {
        await ImageModel.updateOne(
          { _id: image._id },
          { $push: { reactionsusers: { emailuser, reaction: react } } }
        );
        console.log("On ajoute");
        next();
        return res.status(200).json({ message: "ok" });
      } catch (error) {
        console.log("Erreur si l'utilisateur n'a pas encore réagi : " + error);
      }
    }
  } catch (error) {
    console.log(
      "Erreur lors de la gestion de la réaction de l'utilisateur : " + error
    );
    return res.status(500).json({
      message:
        "Erreur serveur lors de la gestion de la réaction de l'utilisateur",
    });
  }
};

//mem code mais vérifie si l'utilisateur retire sa reaction not use
// module.exports.reactionUserOnImageOrPullReaction = async (req, res) => {
//   const { id, emailuser, react } = req.body;

//   try {
//     // Trouver l'image par ID
//     const image = await ImageModel.findById(id);

//     // Vérifier si l'image existe
//     if (!image) {
//       return res
//         .status(200)
//         .json({ message: "Erreur : Identification de l'image impossible" });
//     }

//     // Vérifier si l'utilisateur a déjà réagi
//     const userAlreadyReacted = image.reactionsusers.some(
//       (reaction) => reaction.emailuser === emailuser
//     );

//     if (userAlreadyReacted) {
//       // L'utilisateur a déjà réagi, mise à jour de sa réaction
//       try {
//         // Vérifier si react est null avant de mettre à jour
//         if (react !== null) {
//           await ImageModel.updateOne(
//             { _id: image._id, "reactionsusers.emailuser": emailuser },
//             { $set: { "reactionsusers.$.reaction": react } }
//           );
//         } else {
//           // Si react est null, retirer l'objet contenant l'e-mail de l'utilisateur
//           await ImageModel.updateOne(
//             { _id: image._id },
//             { $pull: { reactionsusers: { emailuser } } }
//           );
//         }
//       } catch (error) {
//         console.log(
//           "Erreur lors de la mise à jour de la réaction de l'utilisateur : " +
//             error
//         );
//       }
//     } else {
//       // L'utilisateur n'a pas encore réagi, ajouter sa réaction si react n'est pas null
//       if (react !== null) {
//         try {
//           await ImageModel.updateOne(
//             { _id: image._id },
//             { $push: { reactionsusers: { emailuser, reaction: react } } }
//           );
//         } catch (error) {
//           console.log(
//             "Erreur si l'utilisateur n'a pas encore réagi : " + error
//           );
//         }
//       }
//     }

//     return res
//       .status(200)
//       .json({ message: "Réaction de l'utilisateur mise à jour avec succès" });
//   } catch (error) {
//     console.log(
//       "Erreur lors de la gestion de la réaction de l'utilisateur : " + error
//     );
//     return res.status(500).json({
//       message:
//         "Erreur serveur lors de la gestion de la réaction de l'utilisateur",
//     });
//   }
// };

//one random image from mongoDB
module.exports.getOneImageMongo = async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      const imageShare = await ImageModel.findById(id);
      // console.log("====================================");
      // console.log(imageShare);
      // console.log("====================================");
      return res.status(200).send(imageShare);
    } catch (error) {}
  } else {
    try {
      //le size : 1 pour dire je veux seul document
      //dans crochet pour obtenir l'objet et non le tableau
      const [imageRandom] = await ImageModel.aggregate([
        { $sample: { size: 1 } },
      ]);
      // console.log("====================================");
      // console.log(imageRandom);
      // console.log("====================================");
      return res.status(200).send(imageRandom);
    } catch (error) {
      console.log("Error to getOneImageMongo");
      console.log(error);
      return res
        .status(200)
        .json({ message: "Erreur lors de la sélection de l'image" });
    }
  }
};
