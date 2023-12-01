// websocket.js
// function initWebSocketServer(io)

const ImageModel = require("../models/image.model");

module.exports.initWebSocketServer = (io) => {
  io.on("connection", (socket) => {
    console.log("Nouvelle connexion websocket");
    // io.emit("reaction", { lol: "lil", lal: "loo" });
    // this.sendNewreaction(io, data);
    sendNewReaction(io, socket);

    socket.on("disconnect", () => {
      console.log("Connexion websocket fermée");
    });
  });

  // Retournez io pour qu'il puisse être utilisé ailleurs si nécessaire
  return io;
};

const sendNewReaction = (io, socket) => {
  //dans le front pour mettre a jour les données faut vérifier si l'id
  //correspond a celui affiché au moment même de la reaction
  //socket.on écoute la l'évenement : new_reaction en front
  socket.on("catch_new_reaction", async (data) => {
    // console.log("Voici l'id ", data.id);
    const id = data.id;
    const imageReaction = await ImageModel.findById(id);
    // console.log("==============socket ======================");
    // console.log(imageReaction);
    // console.log("====================================");
    if (imageReaction) {
      io.emit("send_new_reaction", imageReaction);
    }
  });
};
