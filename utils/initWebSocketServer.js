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
    const reactions = imageReaction.reactionsusers;
    let haha = [];
    let like = [];
    let grrr = [];
    for (let i = 0; i < reactions.length; i++) {
      // console.log(reactions[i]);
      if (reactions[i].reaction === "haha") {
        haha.push(reactions[i].reaction);
      }
      if (reactions[i].reaction === "like") {
        like.push(reactions[i].reaction);
      }
      if (reactions[i].reaction === "grrr") {
        grrr.push(reactions[i].reaction);
      }
    }
    //objet qui contient les objets des reactions
    const imagereactions = {
      haha: haha,
      like: like,
      grrr: grrr,
    };
    //on fusion l'objet de l'image récupéré avec l'objet des reactions
    const imgDisplayShare = {
      ...imageReaction,
      reactions: imagereactions,
    };
    // console.log("==============socket ======================");
    // console.log(imgDisplayShare);
    // console.log("====================================");
    io.emit("send_new_reaction", imgDisplayShare);
  });

  socket.on("catch_new_commentaire", async (data) => {
    const imageCommentaire = await ImageModel.findById(data.id);
    io.emit("send_new_commentaire", imageCommentaire);
  });
};
