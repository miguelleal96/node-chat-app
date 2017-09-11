// console.log(__dirname + '/../public')
// console.log(publicPath)
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  /*
    socket.emit - emits event to a single connection
    io.emit - emits event to every single connection

    Broadcasting - emitting an event, but one specific user
  */
  // emitts event to an individual user who joins
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  })
  // emitts event to all other users connected, except the user who joined
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New User Joined',
    createdAt: new Date().getTime()
  })
  console.log('new user connected')

  // handles created message FROM the client
  socket.on('createMessage', (message) => {
    // console.log('created a message from the client', message)
    // Sends a message TO the client
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })

    // send event to everybody else, but this socket
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   created: new Date().getTime()
    // })
  })

  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})
server.listen(port, () => console.log(`Running server on port ${port}`))
