const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
//envoie d'un message au server
const sendEl = document.querySelector('#send');
document.querySelector('#chat').style.visibility = "hidden";

sendEl.addEventListener('click', (e) => {
  e.preventDefault();

  const message = {
    'text': document.querySelector('#m').value
  };

  socket.emit('char-message', message);
  document.querySelector('#m').value = '';
  if (message.text.trim().length !== 0) {
    socket.emit('chat-message', message);
  }
  document.querySelector('#m').focus();
});
/**
 * Réception d'un message de service
 */
socket.on('service-message', (message) => {
  const messageService = document.createElement('li');
  const textnode = document.createTextNode(message.text);

  messageService.appendChild(textnode);
  document.querySelector('#messages').appendChild(messageService);
});

//reception d'un message du server
socket.on('chat-message', (message) => {
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(message.username + ': ' + message.text);

  nouveauMessage.appendChild(textnode);
  document.querySelector('#messages').appendChild(nouveauMessage);
});

//connection utilisateur
const sendUser = document.querySelector('#logger');

sendUser.addEventListener('click', (e) => {
  e.preventDefault();

  const user = {
    'username': document.querySelector('#login input').value
  };

  if (user.username.length > 0) {
  	document.querySelector('#chat').style.visibility = "";
  	document.querySelector('#login').style.visibility = "hidden";
    socket.emit('user-login', user);
    document.querySelector('#m').focus();
  }
});
