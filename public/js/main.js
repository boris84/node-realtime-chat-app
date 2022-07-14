// Initiate a connection request from client to server to open a websoket and keep that connection open
var socket = io();


socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// Event listener on client for newMessage
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  let li = document.createElement('li');
  li.textContent = `${message.from}: ${message.text}`;
  document.querySelector('.output').appendChild(li);
});









const button = document.querySelector('.btn');
const message = document.querySelector('.message-field');

button.addEventListener('click', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: message.value
  }, function () {

  });
});




// Query DOM
// const output = document.querySelector('.output');
// const name = document.querySelector('.name-field');
// const message = document.querySelector('.message-field');
// const button = document.querySelector('.btn');
// const feedback = document.querySelector('.feedback');
// const emojiTrigger = document.querySelector('span');


// Emit events
// button.addEventListener('click', function () {
//   socket.emit('chat', {
//      name: name.value,
//      message: message.value
//   });
// });


// Feedback message
// message.addEventListener('keypress', function () {
//   socket.emit('typing', name.value);
// });


// Listen for events
// socket.on('chat', function (data) {
//   if (!data.name || !data.message) {
//     return;
//   }
//   feedback.innerHTML = '';
//   output.innerHTML += `<p><strong>${data.name}: </strong>${data.message}</p>`;
// });
//
// socket.on('typing', function (data) {
//   feedback.innerHTML = `<p><em> ${data} is typing a message...</em></p>`;
// })






// Emoji picker
// const picker = new EmojiButton({
//   position: 'top-end'
// });
//
// picker.on('emoji', function (emoji) {
//   message.value += emoji;
// });
//
// emojiTrigger.addEventListener('click', function () {
//   picker.pickerVisible ? picker.hidePicker() : picker.showPicker(message);
// });
