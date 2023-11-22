const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  reactionsimages: {
    //chaque fois que l'utilisateur like,
    //le nom unique de l'image vont ici et la reaction de l'utilisateur aussi
    type: [
      {
        nameimage: String,
        reaction: String,
      },
    ], //un bojet dans le array
    default: [],
  },
});

//user est le nom de la table dans la dataBase
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
