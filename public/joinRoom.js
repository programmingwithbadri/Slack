function joinRoom(roomName) {
  // Send the room name to the server to join the room
  nsSocket.emit("joinRoom", roomName, (noOfMembers) => {
    // Update the number of memebers in the room once joined
    // noOfMembers - ack we got from the server once the event is emitted
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${noOfMembers}<span class="glyphicon glyphicon-user"></span>`;
  });

  // Get the msg history of the room from the server
  nsSocket.on("historyCatchup", (history) => {
    const msgUl = document.querySelector("#messages");
    msgUl.innerHTML = "";
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMsgs = msgUl.innerHTML;
      msgUl.innerHTML = currentMsgs + newMsg;
    });
  });
}
