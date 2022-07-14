const express = require('express');
const app = express();
const http = require('http');
// Configure port for Heroku
const port = process.env.PORT || 8000;
const socket = require('socket.io');

const server = http.createServer(app);
// Socket.io set-up
const io = socket(server);

// Static files
app.use(express.static('public'));


server.listen(port, () => {
  console.log(`listening for requests on port ${port}`);
});







// listening out for an event called 'connection' for when the connection is made between browser and server.
// We pass in a callback to fire when connection is made.
// Inside the callback we can pass a varible which is going to refer to THAT instance of the socket which is created - that 1 particukar socket.
// So say we've got 10 different clients - ALL making a connection, each one is going to have their OWN socket between THAT client and our server.
io.on('connection', (socket) => {
  console.log('New User Connected');

  // Event listener on server for createMessaage
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  })

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
