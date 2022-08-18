const express = require('express');
const app = express();
const http = require('http');
// Configure port for Heroku
const PORT = process.env.PORT || 8000;
const socket = require('socket.io');
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);
// Socket.io set-up
const io = socket(server, {
  cors: {
    origin: 'http://127.0.0.1:8000/'
  }
});
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
let users = new Users();


// Static files
app.use(express.static('public'));


server.listen(PORT, () => {
  console.log(`listening for requests on port ${PORT}`);
});





// Configure Server to allow for Incoming Websocket Connections.
//This means the Server will be able to accept connections and we'll be setting up the client to make the connection.
// The we'll have a persistent connection and we can send data back and forth whether from server to client or client to server.

// listening out for an event called 'connection' for when the connection is made between browser and server.
// We pass in a callback to fire when connection is made.
// Inside the callback we can pass a varible which is going to refer to THAT instance of the socket which is created - that 1 particukar socket.
// So say we've got 10 different clients - ALL making a connection, each one is going to have their OWN socket between THAT client and our server.
io.on('connection', (socket) => {
  console.log('New User Connected');



  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room are required.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // socket.leave('room event')

    // io.emit -> io.to('room event').emit
    // socket.broadcast.emit -> socket.broadcast.to('room event').emit
    // socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Ping. Let\'s chat !'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat...`));
    callback();
  });




  // Event listener on server for createMessaage
  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    if (!message.from || !message.text) {
      callback('Cannot process message. The required fields are empty.');
    }
  });


  // Event listener for createLocationMessage
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage(coords.from, coords.latitude, coords.longitude));
  })


  // Emit notification sound to all sockets except this one
  socket.broadcast.emit('notificationSound', true);


  // Handle typing event
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat.`));
    }
  });

});
