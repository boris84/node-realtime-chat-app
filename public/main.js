// Make connection
const socket = io.connect('http://localhost:8000');



// Query DOM
const output = document.querySelector('.output');
const name = document.querySelector('.name-field');
const message = document.querySelector('.message-field');
const button = document.querySelector('.btn');
const feedback = document.querySelector('.feedback');
const emojiTrigger = document.querySelector('span');


// Emit events
button.addEventListener('click', () => {
  socket.emit('chat', {
     name: name.value,
     message: message.value
  });
});


// Feedback message
message.addEventListener('keypress', () => {
  socket.emit('typing', name.value);
});


// Listen for events
socket.on('chat', (data) => {
  if (!data.name || !data.message) {
    return;
  }
  feedback.innerHTML = '';
  output.innerHTML += `<p><strong>${data.name}: </strong>${data.message}</p>`;
});

socket.on('typing', (data) => {
  feedback.innerHTML = `<p><em> ${data} is typing a message...</em></p>`;
})






// Emoji picker
const picker = new EmojiButton({
  position: 'top-end'
});

picker.on('emoji', (emoji) => {
  message.value += emoji;
})

emojiTrigger.addEventListener('click', () => {
  picker.pickerVisible ? picker.hidePicker() : picker.showPicker(message);
})
