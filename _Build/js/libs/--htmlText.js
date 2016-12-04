function Text(selector){
	if(!selector){
		return null;
	}

	if (!(this instanceof Text)) { 
		return new Text(selector);
	}

	this.store = {
		data : 0,
		dataLast : 0
	};

	if(typeof selector === 'string'){
		this.store.chart = d3.selectAll(selector);
	} else {
		this.store.chart = d3.select(selector);
	}

	this.store.att = {
		textFormat : "{value}",
		extraFormatKeys : [],
		transitionSpeed : 800,
		transitionType: 'cubic-in-out',
		delaySpeed : 1000,
		totalCount : 100,
		decimalPlaces : 0,
		initialSet: true // Sets the text instantly, useful to turn off if loading indicator to be replaced
	};
}

Text.prototype.render = function(){
	var att = this.store.att, dataLast = this.store.dataLast, data = this.store.data, chart = this.store.chart;

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
		.tween("text", function() {
            var node = this, i = d3.interpolate(dataLast, data);
            return function(t) {
            	dataLast = parseFloat(i(t)).toFixed(att.decimalPlaces);

            	textObject.value = parseFloat(i(t)).toFixed(att.decimalPlaces);
            	textObject.percent =  Math.round(((parseFloat(i(t)).toFixed(0) / att.totalCount) * 100));
            	textObject.total = att.totalCount;

                node.textContent = String.formatKeys(att.textFormat, textObject);
            };
        });
    return this;
};

Text.prototype.data = function(value) {
	if (!arguments.length) return this.store.data;
	this.store.dataLast = this.store.data;
	this.store.data = value;
	return this;
};

Text.prototype.att = function (value) {
	if (!arguments.length) return this.store.att;
	for(var keys in value){
		if(value.hasOwnProperty(keys)){
			if(Array.isArray(this.store.att[keys])){ // Override entire array, so setting colors = ['fillA'] will override ['fillA', 'fillB', 'fillC']
				this.store.att[keys] = value[keys];
			} else if(this.store.att[keys] === Object(this.store.att[keys])){ // if this.store.att[keys] is an object need to loop through sub keys to set
				for(var innerKeys in this.store.att[keys]){
					if(value[keys].hasOwnProperty(innerKeys)){
						this.store.att[keys][innerKeys] = value[keys][innerKeys];
					}
				}
			} else {
				this.store.att[keys] = value[keys];
			}
		}	
	}
    return this;
};