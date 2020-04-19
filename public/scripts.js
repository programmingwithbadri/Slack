// Connect to default or main ('/') socket namespace
const userName = prompt("Enter the username");
const socket = io("http://localhost:9000", {
  query: {
    userName
  },
});

// Variable of first namespace
let nsSocket = "";

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
      joinNs(nsEndpoint);
    });
  });
  
  // Join the wiki namespace by default
  joinNs("/wiki");
});
