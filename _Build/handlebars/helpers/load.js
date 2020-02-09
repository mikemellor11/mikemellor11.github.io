var fs = require('fs');

module.exports = function (path, option) {
	return JSON.parse(fs.readFileSync(path));
};