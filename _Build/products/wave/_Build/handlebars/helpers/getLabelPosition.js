module.exports = function (stamp, duration, json) {
	var percent = (+stamp / timeCodeToSeconds(duration)) * 100;
	if(percent > 50){
        return "right";
    }
	return "left";
};

function timeCodeToSeconds(hh_mm_ss){
	var tc_array = hh_mm_ss.split(":"),
		tc_hh = parseInt(tc_array[0], 10),
		tc_mm = parseInt(tc_array[1], 10),
		tc_ss = parseInt(tc_array[2], 10),
		tc_ff = 0,
		tc_in_seconds = 0;
	
	tc_in_seconds = ( tc_hh * 3600 ) + ( tc_mm * 60 ) + tc_ss + tc_ff;
	
	return tc_in_seconds;
}