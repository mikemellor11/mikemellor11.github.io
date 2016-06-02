module.exports = function (globalName, index, extension, json) {
	return globalName + pad(index + 1) + '.' +extension;
};

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}