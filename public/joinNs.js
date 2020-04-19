function joinNs(endpoint) {
  if(nsSocket) {
    // if any socket is opened before, we should close it
    nsSocket.close();

    // Remove the event listener when the ns is switched to avoid submitting data between ns
    document
    .querySelector("#user-input")
    .removeEventListener("submit", formSubmission);
  }
  // Connect to the namespace
  nsSocket = io(`http://localhost:9000${endpoint}`);

  // Update the dom element with the Room info
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
    });

    // Add click listeners for each room
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((roomElem) => {
      roomElem.addEventListener("click", (e) => {
        console.log("Someone clicked on the ", e.target.innerText);
      });
    });

    // Add first room automatically once inside the namespace
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;

    joinRoom(topRoomName);
  });

  // Listen to messages we got from server
  nsSocket.on("messageToClients", (msg) => {
    console.log(msg)
    const newMsg = buildHTML(msg);
    document.querySelector("#messages").innerHTML += newMsg;
  });

  // Click Event listener for form submission
  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission);
}

function formSubmission(event) {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;

  // Emit the message to server once the form is submitted
  nsSocket.emit("newMessageToServer", { text: newMessage });
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
  <li>
      <div class="user-image">
          <img src="${msg.avatar}" />
      </div>
      <div class="user-message">
          <div class="user-name-time">${msg.userName} <span>${convertedDate}</span></div>
          <div class="message-text">${msg.text}</div>
      </div>
  </li>    
  `;
  return newHTML;
}
