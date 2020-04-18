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
});
