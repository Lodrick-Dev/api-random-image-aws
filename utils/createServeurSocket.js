const http = require("http");
const { Server } = require("socket.io");
const { initWebSocketServer } = require("./initWebSocketServer");

module.exports.createServeurWebsocket = (app) => {
  const serverSocket = http.createServer(app);
  const io = new Server(serverSocket, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });
  initWebSocketServer(io);

  return { serverSocket, io };
};
