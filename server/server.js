// console.log(__dirname + '/../public')
// console.log(publicPath)
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('new user connected')
  /*
    socket.emit - emits event to a single connection
    io.emit - emits event to every single connection

    Broadcasting - emitts an event to everyone, but one specific user
  */
  
  // emitts event to an individual user who joins
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

  // emitts event (broadcasts) to all other users connected, except the user who joined
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'))

  // handles created message FROM the client
  socket.on('createMessage', (message, callback) => {
    console.log('createdMessage', message)
    // Sends a message TO all the clients connected
    io.emit('newMessage', generateMessage(message.from, message.text))
    // callback === Aknowledgement or the function provided on the emitter as the third argument
    callback()

  })
  
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  }) 
  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})
server.listen(port, () => console.log(`Running server on port ${port}`))
