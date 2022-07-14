const express = require('express');
const app = express();
// Configure port for Heroku
const port = process.env.PORT || 8000;
const socket = require('socket.io');
// var moment = require('moment');
//
//
//
// var someTimestamp = moment().valueOf();
// console.log(someTimestamp);
//
//
// var createdAt = 1234;
// var date = moment(createdAt);
// console.log(date.format('h:mm a'))



const server = app.listen(port, () => {
  console.log(`listening for requests on port ${port}`);
});

// Static files
app.use(express.static('public'));


// Socket.io set-up
const io = socket(server);


// listening out for an event called 'connection' for when the connection is made between browser and server.
// We pass in a callback to fire when connection is made.
// Inside the callback we can pass a varible which is going to refer to THAT instance of the socket which is created - that 1 particukar socket.
// So say we've got 10 different clients - ALL making a connection, each one is going to have their OWN socket between THAT client and our server.
io.on('connection', (socket) => {
  // console.log('user Connected', socket.id)


  //Handle chat event
  socket.on('chat', (data) => {
    io.sockets.emit('chat', data);
  });

  //Handle typing event
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });


  // socket.on('disconnect', () => {
  //   console.log('user Disconnected', socket.id)
  // })

});
