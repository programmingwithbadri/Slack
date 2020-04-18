const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");

// Host the chat.html file
app.use(express.static(__dirname + "/public"));

// Creates the express server to host
const expressServer = app.listen(9000);

// Create socket server object
const io = socketio(expressServer);

// Listens to Main or default Namespace
io.on("connection", (socket) => {
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });

  // Send all the namespace endpoints info to the connected client
  socket.emit("nsList", nsData);
});

// Listen connections in each namespaces
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    // Socket has connected to some namespace
    // Send the Room info for that particular namespace
    nsSocket.emit("nsRoomLoad", namespace.rooms)
  });
});
