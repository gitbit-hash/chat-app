const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

const puplicDirectoryPath = path.join(process.cwd(), './puplic');

app.use(express.static(puplicDirectoryPath));

io.on('connection', (socket) => {
	console.log('new Websocket connection ');

	socket.emit('message', 'Welcome');

	socket.on('sendMessage', (message) => {
		io.emit('message', message);
	});
});

server.listen(port, () => {
	console.log(`Server is up and running on port: ${port}`);
});
