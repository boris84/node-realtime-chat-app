const express = require('express');
const app = express();
const http = require('http');
// Configure port for Heroku
const port = process.env.PORT || 8000;
const socket = require('socket.io');

const server = http.createServer(app);
// Socket.io set-up
const io = socket(server);
const {generateMessage} = require('./utils/message');


// Static files
app.use(express.static('public'));


server.listen(port, () => {
  console.log(`listening for requests on port ${port}`);
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

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined the chat ..'));

  // Event listener on server for createMessaage
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('1. This is from the server');
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  //Handle chat event
  // socket.on('chat', (data) => {
  //   io.sockets.emit('chat', data);
  // });

  //Handle typing event
  // socket.on('typing', (data) => {
  //   socket.broadcast.emit('typing', data);
  // });

  socket.on('disconnect', () => {
    console.log('User was Disconnected');
  });

});
