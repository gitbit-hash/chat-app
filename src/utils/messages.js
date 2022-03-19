const generayeMessage = (text) => ({
	text,
	createdAt: new Date().getTime(),
});

module.exports = {
	generayeMessage,
};
