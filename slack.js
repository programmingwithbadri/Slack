const express = require("express");
const app = express();
const socketio = require("socket.io");

// Host the chat.html file
app.use(express.static(__dirname + "/public"));

// Creates the express server to host
const expressServer = app.listen(9000);

// Create socket server object
const io = socketio(expressServer);

// Socket events
// Main Namespace
io.on("connection", (socket) => {
  // io.on() = io.of('/').on() because by default socket will run '/' namespace(main)
  socket.emit("messageFromServer", { data: "Welcome to the socketio server" });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });

  // Join the Level1 room under default/main or '/' namespace
  socket.join("level1");
  socket.to("level1").emit("joined", "I have joined level1 room");
});

// Admin Namespace
io.of("/admin").on("connection", (socket) => {
  console.log("Someone connected to admin namespace");
  socket.emit("welcome", "Welcome to admin channel");
});
