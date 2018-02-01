// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use('/', express.static(__dirname + '/public'));

io.on('connection', function(socket){
	let loggedUser;
	/**
 	* Liste des utilisateurs connectés
 	*/
 	const users = [];

	/**
 	* Historique des messages
 	*/
	const messages = [];

    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    /**
   	* Connexion d'un utilisateur via le formulaire
   	*/
  	socket.on('user-login', function (user) {
    	loggedUser = user;
    	//users.push(loggedUser);
    	console.log('user logged in : ' + loggedUser.username);
  	});
    /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  	socket.on('chat-message', function (message) {
  	 message.username = loggedUser.username;
    console.log('message de : ' + message.username);
    io.emit('chat-message', message);
  	});
  	  
});

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(3000, function(){
    console.log('Server is listening on *:3000');
});