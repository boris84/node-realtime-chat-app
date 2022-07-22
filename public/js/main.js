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
const locationButton = document.querySelector('.location-btn');








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
button.addEventListener('click', function () {

  socket.emit('createMessage', {
    from: name.value,
    text: message.value
  }, function () {

    });
    message.value = '';
});


// Emit a Feedback message from client
message.addEventListener('keydown', function () {
  socket.emit('typing', name.value);
});





// Send location

// Send latititude and logitude co-ordinates to every one else connected to the chat app. The geolocation api is available in the client side javascript and is widely supported
locationButton.addEventListener('click', function () {
  // first we need to check if the users browser has access to the geolocation api
  if (!navigator.geolocation) {
    feedback.style.color = "red";
    return feedback.innerHTML = "Geolocation is not supported by your browser.";
  }

  locationButton.setAttribute('disabled', 'disabled');
  document.querySelector('.location-btn i').style.textShadow = 'none';
  document.querySelector('.location-btn').style.innerHTML = 'Sending location ..';
  // getCurrentPosition takes 2 functions. A succes function and a failure function
  navigator.geolocation.getCurrentPosition(function (currentPosition) {
    locationButton.removeAttribute('disabled', 'disabled');
    document.querySelector('.location-btn i').style.textShadow = '0 0 2px #000, -1px 0 2px #000, 3px -0px 3px #000, 1px 2px 3px #000';

    socket.emit('createLocationMessage', {
    latitude: currentPosition.coords.latitude,
    longitude: currentPosition.coords.longitude
  });

  }, function () {
      locationButton.removeAttribute('disabled', 'disabled');
      document.querySelector('.location-btn i').style.textShadow = '0 0 2px #000, -1px 0 2px #000, 3px -0px 3px #000, 1px 2px 3px #000';
      feedback.style.color = "red";
      return feedback.innerHTML = "Unable to fetch location.";
  });
});






// EVENT LISTENERS

// Listen for typing event from server
socket.on('typing', function (data) {
   feedback.innerHTML = `<p><em> ${data} is typing a message...</em></p>`;
});


// Listen for newMessage event from server
socket.on('newMessage', function (message) {
   if (!message.from || !message.text) {
     return;
   }

   feedback.innerHTML = '';

  let formattedTime = moment(message.createdAt).format('h:mm a');

  let p = document.createElement('p');
  p.innerHTML = `<strong>${message.from}</strong>: ${message.text}`;
  document.querySelector('.output').appendChild(p);

  let div = document.createElement('div');
  div.innerHTML = `${formattedTime}`;
  document.querySelector('.output').appendChild(div);

  console.log(message);
});



// Listen for notification event from server
socket.on('notificationSound', function (sound) {
  if (sound) {
    socket.on('newMessage', function () {
       notification.play()
    });
  }
});


socket.on('newLocationMessage', function (message) {

  feedback.innerHTML = '';

  let p = document.createElement('p');
  let a = document.createElement('a');
  a.setAttribute('target', "_blank");
  a.setAttribute('href', message.url);
  a.innerHTML = 'My current location';

  p.innerHTML = `<strong>${message.from}</strong>: `;
  p.appendChild(a);
  document.querySelector('.output').appendChild(p);

  let formattedTime = moment(message.createdAt).format('h:mm a');
  let div = document.createElement('div');
  div.innerHTML = `${formattedTime}`;
  document.querySelector('.output').appendChild(div);
});






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
