const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const adminFirebaseInit = require("./middleware/firebase");

//mettre ici pour que mongo se connect
require("dotenv").config({ path: "./config/.env" });

//connect database
connectDB();

//app / express
const app = express();

//cors policy
const allowedOrigins = ["http://localhost:3000"];
const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  // origin: function (origin, callback) {
  //   if (!origin || allowedOrigins.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("No, not allowed by Cors"));
  //   }
  // },
};
app.use(cors(corsOption));

//permet de trater les deonner de la req avant les routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//vérification direct après connexion avec le server
// app.get("/check")

app.get("/", (req, res, next) => {
  return res.status(200).json({ message: "Ok bro" });
});

app.use("/user/auth", require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/aws", require("./routes/image.routes"));

//route contact

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
