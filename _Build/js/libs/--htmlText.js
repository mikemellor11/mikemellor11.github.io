function createHtmlText(selector){
	if(!selector){
		return null;
	}

	var chart;

	if(typeof selector === 'string'){
		chart = d3.selectAll(selector);
	} else {
		chart = d3.select(selector);
	}

	var data = 0;
	var dataLast = 0;

	var att = {
		textFormat : "{value}",
		extraFormatKeys : [],
		transitionSpeed : 800,
		transitionType: 'cubic-in-out',
		delaySpeed : 1000,
		totalCount : 100,
		decimalPlaces : 0,
		initialSet: true // Sets the text instantly, useful to turn off if loading indicator to be replaced
	};

	function my(){
		var textObject = {
                "value": parseFloat(dataLast).toFixed(att.decimalPlaces),
                "percent": Math.round(((parseFloat(dataLast).toFixed(0) / att.totalCount) * 100)),
                "total": att.totalCount
            }

        att.extraFormatKeys.forEach(function(d){
        	textObject[d.name] = d.value;
        });

        if(att.initialSet){
			chart.text(String.formatKeys(att.textFormat, textObject))
        }

		chart.transition()
			.duration(att.transitionSpeed)
			.delay(att.delaySpeed)
			.duration(att.transitionSpeed)
			.tween("text", function(d) {
	            var i = d3.interpolate(dataLast, data);
	            return function(t) {

	            	dataLast = parseFloat(i(t)).toFixed(att.decimalPlaces);

	            	textObject.value = parseFloat(i(t)).toFixed(att.decimalPlaces);
	            	textObject.percent =  Math.round(((parseFloat(i(t)).toFixed(0) / att.totalCount) * 100));
	            	textObject.total = att.totalCount;

	                this.textContent = String.formatKeys(att.textFormat, textObject);
	            };
	        });
        return my;
	}

	my.data = function(value) {
		if (!arguments.length) return data;
		dataLast = data;
		data = value;
		return my;
	};

	my.attr = function (value) {
		if (!arguments.length) return att;
		for(var keys in value){
			if(value.hasOwnProperty(keys)){
				if(Array.isArray(att[keys])){ // Override entire array, so setting colors = ['fillA'] will override ['fillA', 'fillB', 'fillC']
					att[keys] = value[keys];
				} else if(att[keys] === Object(att[keys])){ // if att[keys] is an object need to loop through sub keys to set
					for(var innerKeys in att[keys]){
						if(value[keys].hasOwnProperty(innerKeys)){
							att[keys][innerKeys] = value[keys][innerKeys];
						}
					}
				} else {
					att[keys] = value[keys];
				}
			}	
		}
	    return my;
	};

	return my;
}