const express = require('express');
const mongoose = require('mongoose');
const chatRouter = require('./ChatRoutes.js');
const messageModel = require('./Message')
const app = express();
const http = require('http').createServer(app)
const cors = require('cors')
const cookieParser = require('cookie-parser')

const io = require('socket.io')(http)

app.use(cors())

app.use(express.json());

mongoose.connect('mongodb+srv://dilan:admin@comp3123.e5acu.mongodb.net/labTest?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

io.on('connection', (socket) => {
  console.log('Connection created...')

  socket.on('join', (roomName, username) => {
    socket.join(roomName)
    const msg = {
      from_user: username,
      message: `Joined the ${roomName} room succesfully`
    }
    socket.broadcast.to(roomName).emit('newMessage', msg)
  })

  socket.on('message', (data) => {
    const msg = {
      message: data.message,
      from_user: data.username
    }
    socket.broadcast.emit('newMessage', msg)
  })

  socket.on('room_messages', (data) => {
    const msg = new messageModel()

    msg.from_user = data.username
    msg.room = data.room
    msg.message = data.message

    const message = {
      msg: data.message,
      name: data.username
    }
    socket.broadcast.to(data.room).emit('newMessage', message)
  })

  socket.on("typing", () => {
    socket.broadcast.emit({ user: socket.username }, " is typing...")
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

app.use(chatRouter);

http.listen(8081, () => { console.log('Server is running...') });
