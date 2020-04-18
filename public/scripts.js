// Connect to default or main ('/') socket namespace
const socket = io("http://localhost:9000"); 

// Listen for all the available namespaces
socket.on("nsList", (nsData) => {
  console.log(nsData)
})
