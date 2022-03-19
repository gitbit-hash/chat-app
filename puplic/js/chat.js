const socket = io();

socket.on('message', (message) => {
	console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
	e.preventDefault();

	const message = e.target.elements.message.value;

	socket.emit('sendMessage', message, (error) => {
		if (error) {
			return console.log(error);
		}

		console.log('Message delivered!');
	});
});

document.querySelector('#send-location').addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert("Sorry, your browser doesn't support Geolocation");
	}

	navigator.geolocation.getCurrentPosition(
		({ coords: { latitude, longitude } }) => {
			socket.emit('sendLocation', { latitude, longitude }, () => {
				console.log('Location shared');
			});
		}
	);
});
