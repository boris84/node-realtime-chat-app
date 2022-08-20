// Query DOM
const name = document.querySelector('.name-field');
const feedback = document.querySelector('.feedback');
const errors = document.querySelector('.errors');
const notification = document.getElementById('notification-sound');
const button = document.querySelector('.btn');
const message = document.querySelector('.message-field');
const sidebar = document.querySelector('.side-bar');
const chatWindow = document.querySelector('.chat-window');
const icon1 = document.querySelector('.icon1');
const icon2 = document.querySelector('.icon2');
const h3 = document.querySelector('h3');
const locationButton = document.querySelector('.location-btn');
const userList = document.querySelector('.users');




// Initiate a connection request from client to server to open a websoket and keep that connection open
var socket = io();

socket.on('connect', function () {
  let params = $.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('no error')
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});


socket.on('updateUserList', function (users) {
  let ol = $('<ol></ol>');

  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));

  });

  $('.users').html(ol);
});



// toggle sidebar button open
icon1.addEventListener('click', function (e) {
  sidebar.classList.add('active');
  icon1.style.display = 'none';
  icon2.style.display = 'block';
  userList.classList.remove('fadeout');
  userList.classList.add('fadein');
});

// toggle sidebar button closed
icon2.addEventListener('click', function (e) {
  sidebar.classList.remove('active');
  icon2.style.display = 'none';
  icon1.style.display = 'block';
  userList.classList.add('fadeout');
  userList.classList.remove('fadein');
});





// EMIT EVENTS

// Enit a new message from client
button.addEventListener('click', function () {

  socket.emit('createMessage', {
    from: name.value,
    text: message.value
  }, function (data) {
       // scroll down
       chatWindow.scrollTop = chatWindow.scrollHeight;
       errors.classList.add('error');
       errors.innerHTML = data;
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
    // scroll down
    chatWindow.scrollTop = chatWindow.scrollHeight;
    errors.classList.add('error');
    return errors.innerHTML = "Geolocation is not supported by your browser.";
  }

  locationButton.setAttribute('disabled', 'disabled');
  document.querySelector('.location-btn i').style.textShadow = 'none';

  // getCurrentPosition takes 2 functions. A succes function and a failure function
  navigator.geolocation.getCurrentPosition(function (currentPosition) {
    locationButton.removeAttribute('disabled', 'disabled');
    document.querySelector('.location-btn i').style.textShadow = '0 0 2px #000, -1px 0 2px #000, 3px -0px 3px #000, 1px 2px 3px #000';

    if (!name.value) {
      // scroll down
      chatWindow.scrollTop = chatWindow.scrollHeight;
      errors.classList.add('error');
      return errors.innerHTML = "Cannot process location. Name is required.";
    }

    socket.emit('createLocationMessage', {
      from: name.value,
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude
    });

}, function () {
     locationButton.removeAttribute('disabled', 'disabled');
     document.querySelector('.location-btn i').style.textShadow = '0 0 2px #000, -1px 0 2px #000, 3px -0px 3px #000, 1px 2px 3px #000';
     // scroll down
     chatWindow.scrollTop = chatWindow.scrollHeight;
     errors.classList.add('error');
     return errors.innerHTML = "Unable to fetch location.";
   });
});






// EVENT LISTENERS

// Listen for typing event from server
socket.on('typing', function (data) {
   // scroll down
   chatWindow.scrollTop = chatWindow.scrollHeight;
   errors.innerHTML = '';
   feedback.innerHTML = `<p><em> ${data} is typing a message ...</em></p>`;
});





// Listen for newMessage event from server
socket.on('newMessage', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#message-template').html();

  if (!message.from || !message.text) {
    return;
  }

  feedback.innerHTML = '';
  errors.innerHTML = '';

  let html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
    feedback: feedback.innerHTML
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
  $('.output').append(html);
  // console.log(message);
});





// Listen for notification event from server
socket.on('notificationSound', function (sound) {

  if (sound) {
    socket.on('newMessage', function () {
      notification.play()
    });
  } else {
      // scroll down
      chatWindow.scrollTop = chatWindow.scrollHeight;
      errors.classList.add('error');
      errors.innerHTML = 'Your browser does not support the audio element required for notification sounds.';
  }
});





socket.on('newLocationMessage', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#location-message-template').html();

  if (!message.from) {
     return;
  }

  feedback.innerHTML = '';
  errors.innerHTML = '';

  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
  $('.output').append(html);
});






// Emoji picker
const emojiTrigger = document.querySelector('span');

// mobile: position: 'bottom-center',
// desktop: position: 'top-end'

const picker = new EmojiButton({
  position: 'bottom-center',
  autoHide: false
});

emojiTrigger.addEventListener('click', function () {
  picker.pickerVisible ? picker.hidePicker() : picker.showPicker(message);
});

// Listen for emoji event
picker.on('emoji', function (emoji) {
  message.value += emoji;
});
