const socket = io();


//envoie d'un message au server
const sendEl = document.querySelector('#send');

sendEl.addEventListener('click', (e) => {
	e.preventDefault();
	
 	const message ={
 		text : document.querySelector('#m').value
 	};
 	socket.emit('char-message',message);
 	document.querySelector('#m').value="";
 	if (message.text.trim().length !== 0) {
 		socket.emit('chat-message', message);
 	}
    document.querySelector('#m').focus();
});

//reception d'un message du server
socket.on('chat-message', function (message) {
 		const nouveauMessage = document.createElement("li");
 		const textnode = document.createTextNode(message.username+': '+message.text);
 		nouveauMessage.appendChild(textnode);
 		document.querySelector('#messages').appendChild(nouveauMessage);
 		console.log(textnode); 
    });

//connection utilisateur
const sendUser = document.querySelector('#logger');

sendUser.addEventListener('click', (e) => {
	e.preventDefault();
	
 	const user ={
 		username : document.querySelector('#login input').value
 	};
 	if (user.username.length > 0) {
 		socket.emit('user-login', user);
 		document.querySelector('#m').focus();
 	}
    
});