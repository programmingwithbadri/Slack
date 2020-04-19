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
    nsSocket.emit("nsRoomLoad", namespace.rooms);

    // When someone joined the room
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      // Leave the previous room when the client want to join any other room
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);

      // Join the requested room
      nsSocket.join(roomToJoin);
      updateUsersInRoom(namespace, roomToJoin);

      // Find the current room object
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle == roomToJoin;
      });

      nsSocket.emit("historyCatchup", nsRoom.history);
    });

    // Listen for the messages emitted by client
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        userName: "dummy_name",
        avatar: "https://via.placeholder.com/30",
      };
      // Pass the received msg to all the clients that are in the room that this socket is in
      // the user will be in the 2nd room in the object list
      // because the socket ALWAYS joins its own room on connection(which is 1st index in the object list)
      // get the keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      // Find the current room object
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle == roomTitle;
      });
      nsRoom.addMessage(fullMsg);

      io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});

function updateUsersInRoom(namespace, roomToJoin) {
  // Get the number of users in the room and
  // Update the no of users in this room to all the sockets
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((error, clients) => {
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit("updatedMembers", clients.length);
    });
}
