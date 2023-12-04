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
  commentairessusers: {
    type: [
      {
        pseudo: {
          type: String,
        },
        commentaire: String,
      },
    ],
    required: false,
    default: [],
  },
});

const ImageModel = mongoose.model("image", imageSchema);
module.exports = ImageModel;
