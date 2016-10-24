module.exports = function (object, type, json) {
	if(typeof object === 'object'){
		if(type.toLowerCase() === 'array' && Array.isArray(object)){
			return true;
		} else if(type.toLowerCase() === 'object' && !Array.isArray(object)){
			return true;
		}

		return false;
	}
	if(typeof object === type){
		return true;
	}
	return false;
};