// console.log(__dirname + '/../public')
// console.log(publicPath)
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const users = new Users()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('new user connected')
  /*
    socket.emit - emits event to a single connection
    io.emit - emits event to every single connection

    socket.broadcast.emit - emitts an event to everyone, but one specific user

    target people in rooms
    socket.to(roomName).emit
    io.to(roomName).emit
    socket.broadcast.to(roomName).emit
  */
  
  
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required')
    }
    
    socket.join(params.room)
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)
    
    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    // emitts event to an individual user who joins
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
  
    // emitts event (broadcasts) to all other users connected, except the user who joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has Joined`))
    
     callback()
  })

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
    const user = users.removeUser(socket.id)

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
    }
    console.log('client disconnected')
  })
})
server.listen(port, () => console.log(`Running server on port ${port}`))
