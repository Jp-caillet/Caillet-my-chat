// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const log = require('caillet-my-log');
const Botyt = require('caillet-my-bot-youtube');
const Botcarouf = require('caillet-my-bot-carouf');

// On gère les requêtes http des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use('/', express.static(`${__dirname}/public`));

io.on('connection', (socket) => {
  let loggedUser;
  /**
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */

  socket.on('disconnect', () => {
    if (loggedUser) {
      console.log('user disconnected : ' + loggedUser.username);
      var serviceMessage = {
        'text': 'User "' + loggedUser.username + '" disconnected',
        'type': 'logout'
      };

      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  /**
   	* connexion d'un utilisateur via le formulaire
   	*/
  socket.on('user-login', (user) => {
    loggedUser = user;
    if (loggedUser) {
      var serviceMessage = {
        'text': 'User "' + loggedUser.username + '" logged in',
        'type': 'login'
      };

      console.log(serviceMessage.text);
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', (message) => {
    if (message.text.indexOf('/carouf') !== - 1) {
      console.log('Carrouf');
      message.username = 'Carrouf le ouf';
      const mybotCarouf = new Botcarouf(message.longitude, message.latitude);

      mybotCarouf.run();
      message.latitude = mybotCarouf.getLatitude(0);
      message.longitude = mybotCarouf.getLongitude(0);
      socket.emit('message-bot-carrouf', message);
    } else if (message.text.indexOf('/ytb') !== - 1) {
      console.log('youtube');
      const request = message.text.substring(message.text.indexOf('/ytb') + 4);
      const mybot = new Botyt(request);

      mybot.run();

      for (let i = 0; i < 5; i ++) {
        if (mybot.getId(i)) {
          message.username = 'Prince of YouTube';
          message.log = log();
          console.log(mybot.getImgVideo(i));
          message.title = mybot.getTitleVideo(i);
          message.urlVid = mybot.getImgVideo(i);
          message.id = mybot.getId(i);
          socket.emit('message-bot-youtube', message);
        }
      }
      console.log(mybot.getId(1));
    } else {
      console.log('normal');
      message.username = loggedUser.username;
      message.log = log();
      console.log('message de : ' + message.username);
      io.emit('chat-message', message);
    }
  });
});

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
server.listen(3000, () => {
  console.log('Server is listening on *:3000');
});
