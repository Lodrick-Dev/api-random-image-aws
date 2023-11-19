const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo connecté g");
  } catch (error) {
    console.error("Erreur sur la connection MongoDB: " + error);
    process.exit();
  }
};

//
// mongoose.connect("mongodb://localhost:27017/test", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   console.log("connecté à Mongoose");
// });

module.exports = connectDB;
