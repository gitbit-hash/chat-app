const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Tempaltes
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
	'#location-message-template'
).innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

socket.on('message', (message) => {
	console.log(message);
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
	console.log(message.url);
	const html = Mustache.render(locationMessageTemplate, {
		username: message.username,
		url: message.url,
		createdAt: moment(message.createdAt).format('h:mm a'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
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

socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = '/';
	}
});
