const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Filter = require('bad-words');
const {
	generateMessage,
	generateLocationMessage,
} = require('./utils/messages');
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

const puplicDirectoryPath = path.join(process.cwd(), './puplic');

app.use(express.static(puplicDirectoryPath));

io.on('connection', (socket) => {
	console.log('new Websocket connection ');

	socket.on('join', ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room });

		if (error) {
			return callback(error);
		}

		socket.join(user.room);

		socket.emit('message', generateMessage('Welcome!'));
		socket.broadcast
			.to(user.room)
			.emit('message', generateMessage(`${user.username} has joined!`));

		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed!');
		}

		io.to('center').emit('message', generateMessage(message));
		callback();
	});

	socket.on('sendLocation', (location, callback) => {
		io.emit(
			'locationMessage',
			generateLocationMessage(
				`https://google.com/maps?q=${location.latitude},${location.longitude}`
			)
		);
		callback();
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.room).emit(
				'message',
				generateMessage(`${user.username} has left the room!`)
			);
		}
	});
});

server.listen(port, () => {
	console.log(`Server is up and running on port: ${port}`);
});
