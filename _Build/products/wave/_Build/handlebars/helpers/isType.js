module.exports = function (object, type, json) {
	if(typeof object === type){
		return true;
	}
	return false;
};