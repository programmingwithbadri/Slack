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

  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", (e) => {
    let messages = Array.from(document.getElementsByClassName("message-text"));
    console.log(messages);
    messages.forEach((msg) => {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        // the msg does not contain the user search term!
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}
