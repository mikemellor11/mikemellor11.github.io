module.exports = function (json) {
	for(var i = 0, len = json.hash.in.length; i < len; i++){
		if(json.hash.in[i][json.hash.key] === json.hash.object){
			if(json.hash.getValue){
				return json.hash.in[i][json.hash.getValue];	
			}
			return json.hash.in[i];
		}
	}
	return {};
};