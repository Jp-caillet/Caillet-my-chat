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
const Botuber = require('caillet-my-bot-uber');
const geocoder = require('geocoder');
const getCoords = require('city-to-coords');

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
    if (message.text.indexOf('/uber to') !== - 1) {
      const request = message.text.substring(message.text.indexOf('/uber to') + 8);

      getCoords(request)
        .then((coords) => {
          const mybotUber = new Botuber(message.longitude, message.latitude, coords.lng, coords.lat);

          mybotUber.run();
          geocoder.reverseGeocode(message.latitude, message.longitude, function gecod (err, data) {
            if (err) {
              return null;
            }
            const messages = {
              'username': 'fast car',
              'text': request,
              'latitude': message.latitude,
              'longitude': message.longitude,
              'longitudeend': coords.lng,
              'latitudeend': coords.lat,
              'price': mybotUber.getPriceEstimate(0),
              'distance': mybotUber.getDistance(0),
              'name': mybotUber.getName(0),
              'city': data.results[0].formatted_address
            };

            socket.emit('message-bot-uber', messages);
            return null;
          });
        });
    } else if (message.text.indexOf('/carouf') !== - 1) {
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
