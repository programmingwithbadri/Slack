function joinRoom(roomName) {
  // Send the room name to the server to join the room
  nsSocket.emit("joinRoom", roomName);

  // Get the msg history of the room from the server
  nsSocket.on("historyCatchup", (history) => {
    const msgUl = document.querySelector("#messages");
    msgUl.innerHTML = "";
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMsgs = msgUl.innerHTML;
      msgUl.innerHTML = currentMsgs + newMsg;
    });
    msgUl.scrollTo(0, msgUl.scrollHeight);
  });

  nsSocket.on("updatedMembers", (noOfMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${noOfMembers}<span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });
}
