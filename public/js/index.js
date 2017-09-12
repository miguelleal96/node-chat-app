const socket = io()

socket.on('connect', function() {
  console.log('connected to server')
  
  /* 
    event emiter inside 'connect' callback because
    we only want to emit the event when connected
  */
  // sends a message TO the server
  // socket.emit('createMessage', {
  //   from: 'Miguel',
  //   text: 'Creating a message from the client'
  // })
})

// handles a new message FROM the server
socket.on('newMessage', function(message) {
  console.log('recieved a new message from the server', message)
  const li = $('<li></li>')
  li.text(`${message.from}: ${message.text}`)

  $('#messages').append(li)
})

socket.on('disconnect', function() {
  console.log('disconnected from server')
})

socket.on('newLocationMessage', function(message) {
  const li = $('<li></li>')
  const a = $('<a target="_blank">My Current Location</a>')

  li.text(`${message.from}: `)
  a.attr('href', message.url)
  li.append(a)
  $('#messages').append(li)
})

$('#message-form').on('submit', function(e) {
  e.preventDefault()
  const inputField = $('[name=message]')
  
  socket.emit('createMessage', {
    from: 'User',
    text: inputField.val()
  }, function() {
    
  })
  
  inputField.val('')
})

const locationButton = $('#send-location')
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }
  
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function() {
    alert('Unable to fetch location')
  })
})

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'hi'
// }, function(data) { 
//   // Aknowledgement - allows event listener to send something back to the event emitter
//   // data = argument passed into the 'callback' from the event handler
//   console.log('Got it', data)
// })