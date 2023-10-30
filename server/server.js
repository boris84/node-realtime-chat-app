const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
let moment = require('moment');

// Configure port for Host
const PORT = process.env.PORT || 8000;
const socket = require('socket.io');

// Socketio-file-upload library
const socketiofileupload = require('socketio-file-upload');

const cors = require('cors');
// Set app to use socketio file-upload router
app.use(socketiofileupload.router);
app.use(cors());

const server = http.createServer(app);
// Socket.io set-up
const io = socket(server, {
  cors: {
    origin: 'http://127.0.0.1:8000/',
  },
});

const { writeFile, readFile } = require('fs');
const { generateMessage, generateLocationMessage, generateImage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
let users = new Users();

// Static files
app.use(express.static('public'));
app.use(express.static('public/uploads'));


// db connection
server.listen(PORT, () => {
  console.log(`listening for requests on port ${PORT}`);
});


let userColor;
// Configure Server to allow for Incoming Websocket Connections.
//This means the Server will be able to accept connections and we'll be setting up the client to make the connection.
// The we'll have a persistent connection and we can send data back and forth whether from server to client or client to server.

// listening out for an event called 'connection' for when the connection is made between browser and server.
// We pass in a callback to fire when connection is made.
// Inside the callback we can pass a varible which is going to refer to THAT instance of the socket which is created - that 1 particukar socket.
// So say we've got 10 different clients - ALL making a connection, each one is going to have their OWN socket between THAT client and our server.
io.on('connection', (socket) => {
  // console.log('New User Connected');
  socket.on('join', (params, callback) => {
    // console.log(params)
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room are required.');
    }

    // Random Color Generator Function
    const randColor = () => {
      let color = '#';
      color += Math.floor(Math.random() * 16777215).toString(16);
      return color;
    };
    userColor = randColor();

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room, userColor);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // socket.leave('room event')

    // io.emit -> io.to('room event').emit
    // socket.broadcast.emit -> socket.broadcast.to('room event').emit
    // socket.emit
    socket.emit('newMessage', generateMessage('Admin',`Welcome to Ping, ${params.name}. Let\'s chat !`,'#313C48'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat...`, '#313C48'));
    callback();
  });



  // Event listener on server for createMessaage
  socket.on('createMessage', (message, callback) => {
      let user = users.getUser(socket.id);

      if (user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text, user.backgroundColor));
      }
      callback(message);
  });



  // Event listener for createLocationMessage
  socket.on('createLocationMessage', (coords) => {
      let user = users.getUser(socket.id);
      if (user) {
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude, user.backgroundColor));
      }
  });



  // Emit notification sound to all sockets except user that sent it
  socket.broadcast.emit('notificationSound', true);



  // Handle typing event
  socket.on('typing', (data) => {
      let user = users.getUser(socket.id);
      if (user && isRealString(data)) {
        socket.broadcast.to(user.room).emit('typing', data);
      }
  });








  // File handler
  var uploader = new socketiofileupload();
  uploader.dir = 'public/uploads';
  uploader.listen(socket);


  // Whenever socket.io successfully uploads the file to the server this fires
  uploader.on('saved', (event) => {
      // set variable on clientDetail object and assign it the file name which can be referenced in client
      event.file.clientDetail.nameOfImage = event.file.name;
      // console.log(event)
  });

  socket.on('image', (data) => {
      let user = users.getUser(socket.id);
      if (user) {
        io.to(user.room).emit('newImage', generateImage(user.name, data.image, user.backgroundColor));
      }
      // console.log(data)
  });

  // if error takes place
  uploader.on('error', (event) => {
      console.log('Uploader error event: ', event);
  });









  // Handle disconnect event
  socket.on('disconnect', () => {
      let user = users.removeUser(socket.id);
      if (user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat.`, '#313C48'));
      }
  });
});




// Random Color Generator Function
// var letters = '0123456789ABCDEF'.split('');
// var color = '#';
//
// function randColor() {
//    for (var i = 0; i < 6; i++ ) {
//      color += letters[Math.floor(Math.random() * 16)];
//    }
//      return color;
//   };
