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
const Botuber = require('bot-uber');
const geocoder = require('geocoder');
const getCoords = require('city-to-coords');
const Bothearstone = require('caillet-my-bot-hearstone');

// On gère les requêtes http des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use('/', express.static(`${__dirname}/public`));

io.on('connection', (socket) => {
  let loggedUser;
  /**
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */

  socket.on('disconnect', () => {
    if (loggedUser) {
      const serviceMessage = {
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
      const serviceMessage = {
        'text': 'User "' + loggedUser.username + '" logged in',
        'type': 'login'
      };

      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', (message) => {
    if (message.text.indexOf('/combat') !== - 1) {
      const request = message.text.substring(message.text.indexOf('/combat') + 8);
      const res = request.split('/');
      const mybotHearstone1 = new Bothearstone(res[0]);

      mybotHearstone1.run();
      const mybotHearstone2 = new Bothearstone(res[1]);

      mybotHearstone2.run();
      let tour1 = mybotHearstone1.getAttack(0) - mybotHearstone2.getHealth(0);
      let tour2 = mybotHearstone2.getAttack(0) - mybotHearstone1.getHealth(0);

      if (tour1 > tour2) {
        message.winner = res[0];
      } else if (tour1 < tour2) {
        message.winner = res[1];
      } else {
        message.winner = 'égalité';
      }
      message.username = 'L\'aubergiste';
      message.url1 = mybotHearstone1.getImg(0);
      message.url2 = mybotHearstone2.getImg(0);

      socket.emit('message-combat', message);
    } else if (message.text.indexOf('/hearstone') !== - 1) {
      const request = message.text.substring(message.text.indexOf('/hearstone') + 11);
      const mybotHearstone = new Bothearstone(request);

      mybotHearstone.run();
      message.username = 'L\'aubergiste';
      message.url = mybotHearstone.getImg(0);
      socket.emit('message-hearstone', message);
    } else if (message.text.indexOf('/uber to') !== - 1) {
      const request = message.text.substring(message.text.indexOf('/uber to') + 8);

      getCoords(request)
        .then((coords) => {
          const mybotUber = new Botuber(message.longitude, message.latitude, coords.lng, coords.lat);

          mybotUber.run();
          geocoder.reverseGeocode(message.latitude, message.longitude, (err, data) => {
            if (err) {
              return null;
            }
            if (mybotUber.getDistance(0)) {
              try {
                const messages = {'username': 'fast car', 'text': request,
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
              } catch (error) {
                const messages = {
                  'username': 'fast car',
                  'error': 'city not found'
                };

                socket.emit('message-error', messages);
              }
            } else {
              const messages = {
                'username': 'fast car',
                'error': 'pas de uber pour cette desination'
              };

              socket.emit('message-error', messages);
            }

            return null;
          });
        });
    } else if (message.text.indexOf('/carouf') !== - 1) {
      message.username = 'Carrouf le ouf';
      const mybotCarouf = new Botcarouf(message.longitude, message.latitude);

      mybotCarouf.run();
      for (let i = 0; i < 5; i ++) {
        message.choix = 'choix ' + i;
        message.address = mybotCarouf.getAdress(i);
        message.latitude = mybotCarouf.getLatitude(i);
        message.longitude = mybotCarouf.getLongitude(i);
        socket.emit('message-bot-carrouf', message);
      }
    } else if (message.text.indexOf('/ytb search') !== - 1) {
      const request = message.text.substring(message.text.indexOf('/ytb search') + 11);
      const mybot = new Botyt(request);

      mybot.run();

      for (let i = 0; i < 5; i ++) {
        if (mybot.getId(i)) {
          message.username = 'Prince of YouTube';
          message.log = log();
          message.title = mybot.getTitleVideo(i);
          message.urlVid = mybot.getImgVideo(i);
          message.id = mybot.getId(i);
          socket.emit('message-bot-youtube', message);
        }
      }
    } else if (message.text.indexOf('/help') !== - 1) {
      const helper = [
        '/ytb search (name of video)',
        '/carouf (permet d\'avoir la liste des carrefour a proximité)',
        '/uber to (ville ou vous souhaitez aller)',
        '/hearstone (name of card)',
        '/combat (name of card 1) / (name of card 2)'];

      for (let i = 0; i < helper.length; i ++) {
        message.username = 'Père castor';
        message.help = helper[i];
        socket.emit('message-helper', message);
      }
    } else {
      message.username = loggedUser.username;
      message.log = log();

      io.emit('chat-message', message);
    }
  });
});

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
server.listen(3000, () => {

});
