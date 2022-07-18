// Query DOM
const name = document.querySelector('.name-field');
const feedback = document.querySelector('.feedback');
const notification = document.getElementById('notification-sound');
const button = document.querySelector('.btn');
const message = document.querySelector('.message-field');
const sidebar = document.querySelector('.side-bar');
const icon1 = document.querySelector('.icon1');
const icon2 = document.querySelector('.icon2');
const h3 = document.querySelector('h3');




// Initiate a connection request from client to server to open a websoket and keep that connection open
var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});




// Toggle sidebar button
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





// EMIT EVENTS

// Enit a new message from client
button.addEventListener('click', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: name.value,
    text: message.value
  }, function () {

    });
    message.value = '';
});


// Emit a Feedback message from client
message.addEventListener('keypress', function () {
  socket.emit('createMessage', name.value);
});





// EVENT LISTENERS

// Listen for typing event from server
socket.on('createMessage', function (data) {
   feedback.innerHTML = `<p><em> ${data} is typing a message...</em></p>`;
});


// Listen for newMessage event from server
socket.on('newMessage', function (message) {
   if (!message.from || !message.text) {
     return;
   }

  feedback.innerHTML = '';

  let formattedTime = moment(message.createdAt).format('h:mm a');

  let div = document.createElement('div');
  document.querySelector('.output').appendChild(div);

  let p = document.createElement('p');
  p.innerHTML = `<strong>${message.from}</strong>: ${message.text}`;
  div.appendChild(p);

  let small = document.createElement('small');
  small.innerHTML = `${formattedTime}`;
  div.appendChild(small);

  console.log(message);
});


// Listen for notification event from server
socket.on('notificationSound', function (sound) {
<<<<<<< HEAD
  if (sound) {
    socket.on('newMessage', function () {
       notification.play()
    })
  }
})
=======
  notification.play()
});
>>>>>>> 58a9aacc7602abceed7403494e5c05f5781dc53f








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
