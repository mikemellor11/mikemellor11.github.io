module.exports = function (stamp, frameRate, json) {
	return parseInt(stamp / frameRate, 10);
};