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
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let div = document.createElement('div');
  document.querySelector('.output').appendChild(div);

  let p = document.createElement('p');
  p.innerHTML = `<strong>${message.from}</strong>: ${message.text}`;
  div.appendChild(p);

  let small = document.createElement('small');
  small.innerHTML = `${formattedTime}`;
  div.appendChild(small);
});






const button = document.querySelector('.btn');
const message = document.querySelector('.message-field');
const sidebar = document.querySelector('.side-bar');
const icon1 = document.querySelector('.icon1');
const icon2 = document.querySelector('.icon2');
const h3 = document.querySelector('h3');

icon1.addEventListener('click', function (e) {
  sidebar.classList.add('active');
  icon1.style.display = 'none';
  icon2.style.display = 'block';
  h3.classList.add('fadein');
  h3.classList.remove('fadeout');
});

icon2.addEventListener('click', function (e) {
  sidebar.classList.remove('active');
  icon2.style.display = 'none';
  icon1.style.display = 'block';
  h3.classList.remove('fadein');
  h3.classList.add('fadeout');
});






button.addEventListener('click', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: message.value
  }, function () {

  });
    message.value = '';
});




// Query DOM
// const output = document.querySelector('.output');
// const name = document.querySelector('.name-field');
// const message = document.querySelector('.message-field');
// const button = document.querySelector('.btn');
// const feedback = document.querySelector('.feedback');


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

const emojiTrigger = document.querySelector('span');

// mobile: position: 'bottom-center',
// desktop: position: 'top-end'

const picker = new EmojiButton({
  position: 'bottom-center'
});

picker.on('emoji', function (emoji) {
  message.value += emoji;
});

emojiTrigger.addEventListener('click', function () {
  picker.pickerVisible ? picker.hidePicker() : picker.showPicker(message);
});
