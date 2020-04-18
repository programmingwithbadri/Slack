const socket = io("http://localhost:9000"); // connects to '/' socket namespace
const socket2 = io("http://localhost:9000/admin"); // connects to '/admin' socket namespace

socket.on("connect", () => {
  console.log(socket.id);
});

socket2.on("connect", () => {
  console.log(socket2.id);
});

socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("dataToServer", { data: "Data from the Client!" });
});

socket2.on("welcome", (dataFromServer) => {
  console.log(dataFromServer);
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { text: newMessage });
});

socket.on("messageToClients", (msg) => {
  console.log(msg);
  document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
});
