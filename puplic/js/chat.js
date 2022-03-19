const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
	console.log(message);
});

$messageForm.addEventListener('submit', (e) => {
	e.preventDefault();

	//Disable
	$messageFormButton.setAttribute('disabled', 'disabled');

	const message = e.target.elements.message.value;

	socket.emit('sendMessage', message, (error) => {
		//Enable
		$messageFormButton.removeAttribute('disabled');
		$messageInput.value = '';
		$messageInput.focus();

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

	//Disable button
	$sendLocationButton.setAttribute('disabled', 'disabled');

	navigator.geolocation.getCurrentPosition(
		({ coords: { latitude, longitude } }) => {
			socket.emit('sendLocation', { latitude, longitude }, () => {
				$sendLocationButton.removeAttribute('disabled');

				console.log('Location shared');
			});
		}
	);
});
