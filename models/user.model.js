const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    requireed: true,
    max: 1024,
    minlength: 6,
  },
  role: {
    type: Number,
    trim: true,
    default: 0,
  },
});

//on hash le mdp avant d'envoyer dans la base de  donnée
userSchema.prev("save", async function (next) {
  const salt = await bcrypt.genSalt(); // on genere le sell
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//pour savoir si le mail exsite deja et comparé le mdp
userSchema.static.loginConnect = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Icorrect email");
};

//to init mot de passe check if email exist
userSchema.statics.checkEmailIfExist = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email incorrect ou n'existe pas");
  } else {
    return user;
  }
};

//user est le nom de la table dans la dataBase
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
