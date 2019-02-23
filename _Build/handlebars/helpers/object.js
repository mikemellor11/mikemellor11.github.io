module.exports = function (string, option) {
	return JSON.parse(string.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
};