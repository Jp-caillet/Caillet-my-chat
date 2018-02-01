const socket = io();


const chatadd = (target) =>{
 	
};
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
 	socket.on('chat-message', function (message) {
 		const nouveauMessage = document.createElement("li");
 		const textnode = document.createTextNode(message.text);
 		nouveauMessage.appendChild(textnode);
 		document.querySelector('#messages').appendChild(nouveauMessage);
 		console.log(textnode); 
    });
    document.querySelector('#m').focus();
})