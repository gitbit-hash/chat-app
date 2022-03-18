const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

const puplicDirectoryPath = path.join(process.cwd(), './puplic');

app.use(express.static(puplicDirectoryPath));

app.listen(port, () => {
	console.log(`Server is up and running on port: ${port}`);
});
