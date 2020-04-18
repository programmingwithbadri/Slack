// Connect to default or main ('/') socket namespace
const socket = io("http://localhost:9000");

// Listen for all the available namespaces
socket.on("nsList", (nsData) => {
  // Update the dom element with the namespace image
  let nsDiv = document.querySelector(".namespaces");
  nsDiv.innerHTML = "";
  nsData.forEach((ns) => {
    nsDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src ="${ns.img}"/></div>`;
  });

  // Add the click listener for the NS
  Array.from(document.getElementsByClassName("namespace")).forEach((nsElem) => {
    nsElem.addEventListener("click", (e) => {
      const nsEndpoint = nsElem.getAttribute("ns");
      console.log(`Navigating to ${nsEndpoint}...`);
    });
  });

  // Connect to the Wiki(home) namespace
  const nsSocket = io("http://localhost:9000/wiki");

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
  });
});
