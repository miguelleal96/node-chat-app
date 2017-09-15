const socket = io()

/* Socket Events */
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
socket.on('disconnect', function() {
  console.log('disconnected from server')
})

// handles a new message FROM the server
socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  const template = $('#message-template').html()
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  })

  $('#messages').append(html) 
})

socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  const template = $('#location-message-template').html()
  const html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  })
  $('#messages').append(html)
})


/* jQuery Events */
$('#message-form').on('submit', function(e) {
  e.preventDefault()
  const inputField = $('[name=message]')
  
  socket.emit('createMessage', {
    from: 'User',
    text: inputField.val()
  }, function() {
    // Aknowledgement - allows event listener to send something back to the event emitter / callback to run after event finishes emitting
    inputField.val('')
  })
})

const locationButton = $('#send-location')
locationButton.on('click', function() {
  _self = $(this)
  if (!navigator.geolocation) 
    return alert('Geolocation not supported by your browser')
  
  $(this).attr('disabled', 'disabled').text('Sending Location...')

  navigator.geolocation.getCurrentPosition(function(position) {
    _self.removeAttr('disabled').text('Send Location')
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function() {
    _self.removeAttr('disabled').text('Send Location')
    alert('Unable to fetch location')
  })
})

// socket.emit('createMessage', {
  //   from: 'Frank',
  //   text: 'hi'
  // }, function(data) { 
//   // data = argument passed into the 'callback' from the event handler
//   console.log('Got it', data)
// })