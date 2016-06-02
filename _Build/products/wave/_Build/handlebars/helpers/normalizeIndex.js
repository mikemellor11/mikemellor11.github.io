module.exports = function (index, json) {
	return pad(+index + 1);
};

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}