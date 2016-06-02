var getTimeStampWithRate = require('./getTimeStampWithRate');
var getFileName = require('./getFileName');

module.exports = function (player, json) {
	if(json.data.root.content[player].slideStamps.length > 0){
		json.data.root.content[player].slideStamps.forEach(function(d, i){
			d.slideFileName = getFileName(json.data.root.content[player].slideFileNamePrefix, i, json.data.root.content[player].slideFileExtension);
		});
	}
    else {
    	if(json.data.root.xmeml.sequence.media.video.track.length) {
	        json.data.root.xmeml.sequence.media.video.track.forEach(function(d){
	        	if(d.clipitem) {
	                d.clipitem.forEach(function(dl){
	                	json.data.root.content[player].slideStamps.push({
		                    'time': getTimeStampWithRate(dl.start, json.data.root.xmeml.sequence.timecode.rate.timebase),
		                    'slideFileName': dl.name
		                });
	                });
	            }
	        });
	    } else {
	        if (json.data.root.xmeml.sequence.media.video.track.clipitem) {
	            json.data.root.xmeml.sequence.media.video.track.clipitem.forEach(function(d){
	            	json.data.root.content[player].slideStamps.push({
	                    'time': getTimeStampWithRate(dl.start, json.data.root.xmeml.sequence.timecode.rate.timebase),
	                    'slideFileName': d.name
	                });
	            });
	        }
	    }
    }
};