const socket = io('http://localhost:9000');
    console.log(socket.io)
    socket.on('connect',()=>{
        console.log(socket.id)
    })
    socket.on('messageFromServer',(dataFromServer)=>{
        console.log(dataFromServer);
        socket.emit('dataToServer',{data: "Data from the Client!"})
    })

    document.querySelector('#message-form').addEventListener('submit',(event)=>{
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        socket.emit('newMessageToServer',{text: newMessage})
    })

    socket.on('messageToClients',(msg)=>{
        console.log(msg)
        document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
    })