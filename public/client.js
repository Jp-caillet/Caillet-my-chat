const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
//envoie d'un message au server
const sendEl = document.querySelector('#send');

document.querySelector('#chat').style.visibility = 'hidden';

sendEl.addEventListener('click', (e) => {
  e.preventDefault();
  if (document.querySelector('#m').value.indexOf('/carouf') !== - 1 || document.querySelector('#m').value.indexOf('/uber to') !== - 1) {
    getLocation();

    document.querySelector('#m').focus();
  } else {
    const message = {
      'text': document.querySelector('#m').value
    };

    document.querySelector('#m').value = '';
    if (message.text.trim().length !== 0) {
      socket.emit('chat-message', message);
    }
    document.querySelector('#m').focus();
  }
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
  const textnode = document.createTextNode(message.username + ': ' + message.text + ' (' + message.log + ')');

  nouveauMessage.appendChild(textnode);
  document.querySelector('#messages').appendChild(nouveauMessage);
});
//reception d'une erreur
socket.on('message-error', (message) => {
  document.querySelector('#m').value = '';
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(message.username + ': ' + message.error);

  nouveauMessage.appendChild(textnode);
  document.querySelector('#messages').appendChild(nouveauMessage);
});
//reception d'un helper
socket.on('message-helper', (message) => {
  document.querySelector('#m').value = '';
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(message.username + ': ' + message.help);

  nouveauMessage.appendChild(textnode);
  document.querySelector('#messages').appendChild(nouveauMessage);
});
//reception du bot hearstone
socket.on('message-hearstone', (message) => {
  document.querySelector('#m').value = '';
  const nouveauMessage = document.createElement('li');
  const img = document.createElement('img');
  const textnode = document.createTextNode(message.username + ': ');

  img.setAttribute('src', message.url);
  nouveauMessage.appendChild(textnode);
  nouveauMessage.appendChild(img);
  document.querySelector('#messages').appendChild(nouveauMessage);
});
//reception du combat hearstone
socket.on('message-combat', (message) => {
  document.querySelector('#m').value = '';
  const nouveauMessage = document.createElement('li');
  const img1 = document.createElement('img');
  const textnode = document.createTextNode(message.username + ': ');
  const br = document.createElement('br');
  const winner = document.createTextNode('and the winner is ' + message.winner);
  const img2 = document.createElement('img');
  const versus = document.createElement('img');

  img1.setAttribute('src', message.url1);
  img2.setAttribute('src', message.url2);
  versus.setAttribute('src', 'http://img.over-blog-kiwi.com/1/00/19/38/20140818/ob_af021d_versus-3af003f.png');

  nouveauMessage.appendChild(textnode);
  nouveauMessage.appendChild(img1);
  nouveauMessage.appendChild(versus);
  nouveauMessage.appendChild(img2);
  nouveauMessage.appendChild(br);
  nouveauMessage.appendChild(winner);

  document.querySelector('#messages').appendChild(nouveauMessage);
});
//reception d'un message du bot youtube
socket.on('message-bot-youtube', (message) => {
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(`${message.username} :`);
  const titleString = document.createTextNode(message.title);

  const nouveauDiv = document.createElement('div');
  const nouveauImage = document.createElement('img');

  nouveauImage.setAttribute('src', message.urlVid);
  nouveauImage.setAttribute('id', message.id);

  nouveauImage.addEventListener('click', (e) => {
    e.preventDefault();
    const nouveauIframe = document.createElement('iframe');

    nouveauIframe.setAttribute('id', 'player');
    nouveauIframe.setAttribute('type', 'text/html');
    nouveauIframe.setAttribute('width', '650');
    nouveauIframe.setAttribute('height', '300');
    nouveauIframe.setAttribute('src', `http://www.youtube.com/embed/${message.id}`);
    document.querySelector('#messages').appendChild(nouveauIframe);
  });
  nouveauMessage.appendChild(textnode);
  nouveauMessage.appendChild(titleString);
  nouveauDiv.appendChild(nouveauImage);
  nouveauMessage.appendChild(nouveauDiv);
  document.querySelector('#messages').appendChild(nouveauMessage);
});
//reception d'un message du bot uber
socket.on('message-bot-uber', (message) => {
  document.querySelector('#m').value = '';
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(message.username + ': vous voulez aller ' + message.text + ' ca vous coutera ' + message.price + ' grace à ' + message.name + ' pour une distance de ' + message.distance + 'km ');
  const nouveauIframe = document.createElement('iframe');

  nouveauIframe.setAttribute('src', `https://www.google.com/maps/embed/v1/directions?key=AIzaSyC7RyFv7u6BLK5sEYUcSF9y2x_lqGg0iVA&origin=${message.city}&destination=${message.text}&avoid=tolls|highways`);
  nouveauIframe.setAttribute('width', '650');
  nouveauIframe.setAttribute('height', '300');
  nouveauMessage.appendChild(textnode);
  nouveauMessage.appendChild(nouveauIframe);
  document.querySelector('#messages').appendChild(nouveauMessage);
});
//reception d'un message du bot carrefour
socket.on('message-bot-carrouf', (message) => {
  document.querySelector('#m').value = '';
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(`${message.username} : ${message.choix} ${message.address} (clique pour voir la map)`);

  nouveauMessage.addEventListener('click', (e) => {
    e.preventDefault();
    const nouveauIframe = document.createElement('iframe');

    nouveauIframe.setAttribute('src', `https://www.google.com/maps/embed/v1/place?key=AIzaSyC7RyFv7u6BLK5sEYUcSF9y2x_lqGg0iVA&q=${message.latitude},${message.longitude}`);
    nouveauIframe.setAttribute('width', '650');
    nouveauIframe.setAttribute('height', '300');
    document.querySelector('#messages').appendChild(nouveauIframe);
  });
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
    document.querySelector('#chat').style.visibility = '';
    document.querySelector('#login').style.visibility = 'hidden';
    socket.emit('user-login', user);
    document.querySelector('#m').focus();
  }
});

function getLocation () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition (position) {
  const message = {
    'text': document.querySelector('#m').value,
    'latitude': position.coords.latitude,
    'longitude': position.coords.longitude
  };

  socket.emit('chat-message', message);
}
