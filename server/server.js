const express = require('express');
const app = express();
const http = require('http');
// Configure port for Heroku
const PORT = process.env.PORT || 2000;
const socket = require('socket.io');
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);

// Socket.io set-up
const io = socket(server, {
  cors: {
    origin: 'http://127.0.0.1:2000/'
  }
});
const {generateMessage, generateLocationMessage} = require('./utils/message');

const redis = require('redis');
const url = REDIS_URL || 'redis://127.0.0.1:6379';
const client = redis.createClient({
  url: url
});
client.connect().then(() => {
  console.log('redis client connected');
})
.catch((err) => {
  console.log(err.message)
})





// Static files
app.use(express.static('public'));


server.listen(PORT, () => {
  console.log(`listening for requests on port ${PORT}`);
});



function sendMessage(socket) {
  client.LRANGE('messages', '0', '-1', (err, data) => {
    return data;
  })
  .then((data) => {
    data.map(x => {
      const userMessage = x.split(':');
      const redisUsername = userMessage[0];
      const redisMessage = userMessage[1];

      socket.emit('newMessage', {
        from: redisUsername,
        text: redisMessage,
      });
    })
  })
}



// Configure Server to allow for Incoming Websocket Connections.
//This means the Server will be able to accept connections and we'll be setting up the client to make the connection.
// The we'll have a persistent connection and we can send data back and forth whether from server to client or client to server.

// listening out for an event called 'connection' for when the connection is made between browser and server.
// We pass in a callback to fire when connection is made.
// Inside the callback we can pass a varible which is going to refer to THAT instance of the socket which is created - that 1 particukar socket.
// So say we've got 10 different clients - ALL making a connection, each one is going to have their OWN socket between THAT client and our server.
io.on('connection', (socket) => {
  console.log('New User Connected');
  sendMessage(socket);

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to Ping. Let\'s chat !'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined the chat ..'));

  // Event listener on server for createMessaage
  socket.on('createMessage', (message, callback) => {
    client.RPUSH('messages', `${message.from}:${message.text}`);

    io.sockets.emit('newMessage', generateMessage(message.from, message.text));
    callback();
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
    console.log('User was Disconnected');
  });

});
