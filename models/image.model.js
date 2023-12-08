const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  nameimage: {
    type: String,
    required: true,
  },
  reactionsusers: {
    type: [
      {
        emailuser: {
          type: String,
          unique: true,
        },
        reaction: String,
      },
    ],
    required: false,
    default: [],
  },
  commentaires: [
    {
      pseudo: {
        type: String,
        required: true,
      },
      texte: {
        type: String,
        required: true,
      },
      iduser: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const ImageModel = mongoose.model("image", imageSchema);
module.exports = ImageModel;
