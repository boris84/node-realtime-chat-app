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
const {generateMessage} = require('./utils/message');



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

  socket.emit('newMessage', generateMessage('Simon', 'Welcome to the chat app'));
  socket.broadcast.emit('newMessage', generateMessage('Simon', 'A new user has joined the chat ..'));

  // Event listener on server for createMessaage
  socket.on('createMessage', (message) => {
    socket.broadcast.emit('createMessage', message);
    console.log('createMessage', message);
    // callback('recieved data');
    io.sockets.emit('newMessage', generateMessage(message.from, message.text));
    // Emit notification sound to all sockets except this one
    socket.broadcast.emit('notificationSound', true);
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });





  // Handle typing event
  // socket.on('typing', (data) => {
  //   socket.broadcast.emit('typing', data);
  // });


  socket.on('disconnect', () => {
    console.log('User was Disconnected');
  });

});
