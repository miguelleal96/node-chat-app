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
  console.log('new user connected')

  // Sends a message TO the client
  socket.emit('newMessage', {
    from: 'asdf@test.com',
    text: 'Sending a message from the server',
    createdAt: new Date()
  })

  // handles created message FROM the client
  socket.on('createMessage', (message) => {
    console.log('created a message from the client', message)
  })

  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})
server.listen(port, () => console.log(`Running server on port ${port}`))