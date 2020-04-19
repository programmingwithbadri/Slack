function joinNs(endpoint) {
  // Connect to the Wiki(home) namespace
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

    joinRoom(topRoomName)
  });
}