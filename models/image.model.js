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
    default: [],
  },
});

const ImageModel = mongoose.model("image", imageSchema);
module.exports = ImageModel;
