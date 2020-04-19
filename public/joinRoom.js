function joinRoom(roomName) {
  // Send the room name to the server to join the room
  nsSocket.emit("joinRoom", roomName, (noOfMembers) => {
    // Update the number of memebers in the room once joined
    // noOfMembers - ack we got from the server once the event is emitted
    document.querySelector('.curr-room-num-users').innerHTML = `${noOfMembers}<span class="glyphicon glyphicon-user"></span>`
  });
}
