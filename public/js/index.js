const socket = io()

socket.on('connect', function() {
  console.log('connected to server')
  
  /* 
    event emiter inside 'connect' callback because
    we only want to emit the event when connected
  */
  // sends a message TO the server
  socket.emit('createMessage', {
    from: 'Miguel',
    text: 'Creating a message from the client'
  })
})

// handles a new message FROM the server
socket.on('newMessage', function(message) {
  console.log('recieved a new message from the server', message)
})

socket.on('disconnect', function() {
  console.log('disconnected from server')
})