// Query DOM
const name = document.querySelector('.name-field');
const message = document.querySelector('.message-field');
const feedback = document.querySelector('.feedback');
const form = document.getElementById('form');
const errors = document.querySelector('.errors');
const notification = document.getElementById('notification-sound');
const button = document.querySelector('.btn');
const locationButton = document.querySelector('.location-btn');
const sidebar = document.querySelector('.side-bar');
const chatWindow = document.querySelector('.chat-window');
const icon1 = document.querySelector('.icon1');
const icon2 = document.querySelector('.icon2');
const h3 = document.querySelector('h3');
const userList = document.querySelector('.users');
const fileFieldInput = document.getElementById('file');
const customFileButton = document.querySelector('.file-btn');
const customFileText = document.querySelector('.custom-file-text');

// Initiate a connection request from client to server to open a websoket and keep that connection open
let socket = io();



// Custom file upload button & Custom file text
customFileButton.addEventListener('click', function() {
  fileFieldInput.click();
});

const uploadFiles = function(files) {
  if (fileFieldInput.value) {
    // Remove initial customFileText
    customFileText.style.display = 'none';

    // Crete a new element
    let small = document.createElement('small');
    small.setAttribute('class', 'custom-file-text');
    $(small).insertBefore('.btn-container');

    // loop through every file and get the name of the file
    for (var i = 0; i < fileFieldInput.files.length; ++i) {
      small.innerHTML += ' ' + fileFieldInput.files.item(i).name + ' *';
      small.style.color = 'lime';
    }

    setTimeout(() => {
      small.remove();
      customFileText.style.display = 'block';
    }, 5000);
  }
};




// Invoke socket.io file upload library
let siofu = new SocketIOFileUpload(socket);
siofu.listenOnInput(fileFieldInput);
// listen for progress event & log file progress by percent
siofu.addEventListener('progress', function(event) {
  let percent = (event.bytesLoaded / event.file.size) * 100;
  // console.log('File is: ', percent.toFixed(2), 'percent loaded');
});


// completion event which catches the name of file which is passed from server
siofu.addEventListener('complete', function(event) {
  socket.emit('image', {
    image: event.detail.nameOfImage,
    backgroundColor: event.detail.backgroundColor
  });
  // console.log(event)
});




// Event listener for newImage event from server
socket.on('newImage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#image-template').html();

  feedback.innerHTML = '';
  errors.innerHTML = '';
  // console.log(message);

  let html = Mustache.render(template, {
    from: message.from,
    image: message.image,
    backgroundColor: message.backgroundColor,
    createdAt: formattedTime
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
  $('.output').append(html);
})




// toggle sidebar button open
icon1.addEventListener('click', function(e) {
  sidebar.classList.add('active');
  icon1.style.display = 'none';
  icon2.style.display = 'block';
  userList.classList.remove('fadeout');
  userList.classList.add('fadein');
});

// toggle sidebar button closed
icon2.addEventListener('click', function(e) {
  sidebar.classList.remove('active');
  icon2.style.display = 'none';
  icon1.style.display = 'block';
  userList.classList.add('fadeout');
  userList.classList.remove('fadein');
});




socket.on('connect', function() {
  let params = $.deparam(window.location.search);
  // localStorage.setItem('name', params.name);
  // name.value = localStorage.getItem('name');
  name.value = params.name;

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
     // console.log('no error');
    }
  });
});





// Event listener for disconnect event from server
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});




// Event listener for updateUserList event from server
socket.on('updateUserList', function(users) {
  let ol = $('<ol></ol>');

  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));
  });

  $('.users').html(ol);
});





  // socket.on('joinedroom', function() {
  //   console.log('client1 event triggered')
  // })
  //
  // setTimeout(() => {
  //   let params = $.deparam(window.location.search);
  //
  //   socket.emit('join_room')
  // }, 3000)
  //





// Emit createMessage event from client to server
button.addEventListener('click', function() {

    socket.emit('createMessage', {
      text: message.value
    }, function (message) {
         // scroll down
         // chatWindow.scrollTop = chatWindow.scrollHeight;
         errors.classList.add('error');
         errors.innerHTML = '';
    });
      message.value = '';
})







// Emit a typing event from client to server
message.addEventListener('keydown', function() {
  socket.emit('typing', name.value);
});




// Send location. Send latititude and logitude co-ordinates to every one else connected to the chat app. The geolocation api is available in the client side javascript and is widely supported
locationButton.addEventListener('click', function() {
  // first we need to check if the users browser has access to the geolocation api
  if (!navigator.geolocation) {
    // scroll down
    chatWindow.scrollTop = chatWindow.scrollHeight;
    errors.classList.add('error');
    return errors.innerText = "Geolocation is not supported by your browser.";
  }

  locationButton.setAttribute('disabled', 'disabled');
  document.querySelector('.location-btn i').style.textShadow = 'none';

  // getCurrentPosition takes 2 functions. A succes function and a failure function
  navigator.geolocation.getCurrentPosition(function(currentPosition) {
    locationButton.removeAttribute('disabled', 'disabled');
    document.querySelector('.location-btn i').style.textShadow = '0 0 2px #000, -1px 0 2px #000, 3px -0px 3px #000, 1px 2px 3px #000';

    if (!name.value) {
      // scroll down
      chatWindow.scrollTop = chatWindow.scrollHeight;
      errors.classList.add('error');
      return errors.innerText = "Cannot process location. Name is required.";
    }
    // Emit createLocationMessage event with geolocation coords from client to server
    socket.emit('createLocationMessage', {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
      backgroundColor: currentPosition.coords.backgroundColor
    });

}, function () {
     locationButton.removeAttribute('disabled', 'disabled');
     document.querySelector('.location-btn i').style.textShadow = '0 0 2px #000, -1px 0 2px #000, 3px -0px 3px #000, 1px 2px 3px #000';
     // scroll down
     chatWindow.scrollTop = chatWindow.scrollHeight;
     errors.classList.add('error');
     return errors.innerText = "Unable to fetch location.";
   });
});






// Listen for typing event from server
socket.on('typing', function(data) {
   // scroll down
   chatWindow.scrollTop = chatWindow.scrollHeight;
   errors.innerHTML = '';
   feedback.innerHTML = `<p><em> ${data} is typing a message ...</em></p>`;
});




// Event listener for newMessage event from server
socket.on('newMessage', function(message) {

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
    backgroundColor: message.backgroundColor,
    createdAt: formattedTime
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
  $('.output').append(html);

  // Add message to localStorage
  // addMessageToLocalStorage(message);
});







// Event listener for notificationSound event from server
socket.on('notificationSound', function(sound) {

  if (sound) {
    socket.on('newMessage', function() {
      notification.play()
    });
  } else {
      // scroll down
      // chatWindow.scrollTop = chatWindow.scrollHeight;
      errors.classList.add('error');
      // errors.innerHTML = 'Your browser does not support the audio element required for notification sounds.';
  }
});




// Event listener for newLocationMessage event from server
socket.on('newLocationMessage', function(message) {
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
    backgroundColor: message.backgroundColor,
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

emojiTrigger.addEventListener('click', function() {
  picker.pickerVisible ? picker.hidePicker() : picker.showPicker(message);
});

// Listen for emoji event
picker.on('emoji', function (emoji) {
  message.value += emoji;
});
