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
      // console.log('no error')
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
    return errors.innerText = "Geolocation is not supported by your browser.";
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
      return errors.innerText = "Cannot process location. Name is required.";
    }

    socket.emit('createLocationMessage', {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude
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






// EVENT LISTENERS

// Listen for typing event from server
socket.on('typing', function (data) {
   // scroll down
   chatWindow.scrollTop = chatWindow.scrollHeight;
   errors.innerHTML = '';
   feedback.innerHTML = `<p><em> ${data} is typing a message ...</em></p>`;
});




// class User {
//   constructor(name, tag, color) {
//     this.name = name;
//     this.email = email;
//     this.color = color;
//   }
// }
// let userOne = new User('Admin', )


// the new keyword
// - creates a new empty object
// - sets the value of 'this' to be the new empty object
// - calls the constructor method















// Listen for newMessage event from server
socket.on('newMessage', function (message) {
  // console.log(message.from)
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


  const pTags = document.querySelectorAll('.ptag');
  // console.log(pTags)
  // console.log(Array.isArray(Array.from(pTags)));

  pTags.forEach(function(ptag) {
  // console.log(ptag)
    class User {
      constructor(name, tag, color) {
        this.name = name;
        this.tag = tag;
        this.color = color;
        this.id = 0;
      }
      addColor() {
        this.tag.style.background += this.color;
      }
      removeColor() {
        this.tag.style.background -= this.color;
      }
    }

    let userOne = new User(ptag.firstChild.textContent, ptag, 'darkslategray');
    let userTwo = new User(ptag.firstChild.textContent, ptag, 'seagreen');
    let userThree = new User(ptag.firstChild.textContent, ptag, 'navy');
    let params = $.deparam(window.location.search);

    if (message.from === 'Admin') {
      userOne.addColor();
    }

 })

}); // end of newMessage event








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









// var letters = '0123456789ABCDEF'.split('');
// var color = '#';
//
// function randColor() {
//    for (var i = 0; i < 6; i++ ) {
//      color += letters[Math.floor(Math.random() * 16)];
//    }
//      return color;
//   };





//  const addColor = (callback) => {
//    const pTags = document.getElementsByClassName('ptag');
//    console.log(pTags[0].attributes[1])
//    console.log(Array.isArray(Array.from(pTags)));

//    Array.from(pTags).forEach(function(ptag) {
//      let user = ptag.firstChild.innerText;
//
//      // console.log(ptag.attributes.style.value)
//
//        if (message.from === 'Admin') {
//            callback(user, ptag, 'darkslategray');
//        }
//
//        if (ptag.attributes[1] === undefined) {
//            callback(user, ptag, 'darkgoldenrod');
//        }
//   })
// };
//
// addaColor((user, tag, color) => {
//   return tag.style.background += color;
// })
