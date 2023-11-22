const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  nameimage: {
    type: String,
    required: true,
  },
  reactionsusers: {
    type: [
      {
        nameuser: String,
        reaction: String,
      },
    ],
    default: [],
  },
  share: {
    type: [String],
    default: [],
  },
});

const ImageModel = mongoose.model("image", imageSchema);
module.exports = ImageModel;
