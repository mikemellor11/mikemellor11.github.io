function setupBase(){
	var chart = this.store.chart;

	updateViewBox.call(this);

	if(!this.store.svgText){
		chart.append("svg:foreignObject")
			.attr("class", "yLabel")
		    .append("xhtml:div");

		chart.append("svg:foreignObject")
			.attr("class", "xLabel")
		    .append("xhtml:div");
	} else {
		chart.append("g")
			.attr("class", "yLabel")
			.append("text")
			.attr('y', '1em')
			.attr('x', 0);

		chart.append("g")
			.attr("class", "xLabel")
			.append("text")
			.attr('y', '1em')
			.attr('x', 0);
	}

	chart.append("g").attr("class", "x axis");
	chart.append("g").attr("class", "y axis");

	bottom = chart.append("g").attr("class", "bottom");
	draw = chart.append("g").attr("class", "draw");
}

function updateViewBox(){
	var att = this.store.att;

	att.height = (att.width * att.aspectRatio);
	this.store.chart.attr("viewBox", "0 0 " + att.width + " " + att.height);
}

function getYValue(d, plotYValue){
	return (!plotYValue) ? d.value : d.value[plotYValue];
}

function getXValue(d){
	var att = this.store.att;

	if(att.xScale === 'date') {
		return att.parseDate(d.id);
	} else if(att.plotXValue === null) {
		return d.id;
	} else {
		return att.plotXValue(d.id);
	}
}

function createXScale(){
	var att = this.store.att, data = this.store.data;

	var combine = [];

	// Loop over data/values, put all id's into single array, then map to xScale below
	if(data.length > 0){
		combine = data.map(function(d, i){
	    	return d.values;
		    }).reduce(function(a, b){
		    	return a.concat(b);
		    });
	}

    if(att.xScale === null){
    	this.store._xScale = d3.scalePoint()
		    .domain(combine.map(function(d){return d.id;}))
		    .range([0, this.store._width]);

    	if(att.roundPoints){
			this.store._xScale.round();
    	}

    	if(att.labelWidth === 'auto'){
    		this.store.plotWidth = (this.store._xScale.range()[1] - this.store._xScale.range()[0]);
    	} else {
    		this.store.plotWidth = +att.labelWidth;
    	}

    } else if(att.xScale === 'date') {
    	this.store._xScale = d3.scaleTime()
			.domain([
				(att.xMin) ? att.parseDate(att.xMin) : d3.min(combine, function(d){ return att.parseDate(d.id); }), 
				(att.xMax) ? att.parseDate(att.xMax) : d3.max(combine, function(d){ return att.parseDate(d.id); })
				])
			.nice(d3.timeWeek)
			.range([0, this.store._width]);

		if(att.labelWidth === 'auto'){
    		this.store.plotWidth = (this.store._xScale.range()[1] - this.store._xScale.range()[0]);
    	} else {
    		this.store.plotWidth = +att.labelWidth;
    	}

    } else if(att.xScale === 'linear') {
		this.store._xScale = d3.scaleLinear()
		    .domain([
				(att.xMin) ? att.xMin : d3.min(combine, function(d){ return +d.id; }), 
				(att.xMax) ? att.xMax : d3.max(combine, function(d){ return +d.id; })
				])
		    .range([0, this.store._width]);

	    if(att.labelWidth === 'auto'){
    		this.store.plotWidth = this.store._xScale.range()[1] / data[0].values.length;
    	} else {
    		this.store.plotWidth = +att.labelWidth;
    	}

    } else {
    	xScale = att.xScale(att, data);
    }
}

function createYScale(){
	var att = this.store.att, data = this.store.data;

	this.store._yScale = d3.scaleLinear()
	    .domain([
			(att.yMin) ? att.yMin : d3.min(data, function(d) { return d3.min(d.values, function(d) { return +getYValue(d, att.plotYValue); }); }),
			(att.yMax) ? att.yMax : d3.max(data, function(d) { return d3.max(d.values, function(d) { return +getYValue(d, att.plotYValue); }); })
			])
	    .range((att.flipYAxis) ? [0, this.store._height] : [this.store._height, 0]);
}

function renderAxis() {
	var local = this.store, att = local.att, data = local.data, chart = local.chart;

	if(!local.svgText) {
    	if(att.xLabel){
    		chart.select(".xLabel")
    			.attr("transform", "translate(0, 0)")
			    .attr("width", local._width)
			    .select('div')
		        .html(att.xLabel)
		        .each(function(){
		        	d3.select(this.parentNode).attr("height", this.clientHeight)
		        	d3.select(this.parentNode).attr("transform", "translate(" + (att.margin.left) + ", " + (local._height + att.margin.top + local._margin.bottom - this.clientHeight) + ")")
		        });
    	}
    	if(att.yLabel){
    		chart.select(".yLabel")
				.attr("transform", "translate(0, " + (att.margin.top + local._height) + ") rotate(-90)")
			    .attr("width", local._height)
			    .select('div')
		        .html(att.yLabel)
		        .each(function(){
		        	d3.select(this.parentNode).attr("height", this.clientHeight)
		        });
    	}
    } else {
    	if(att.xLabel){
    		chart.select(".xLabel")
				.select('text')
				.text(att.xLabel)
				.call(wrap, local._width)
				.attr("transform", function(){ return "translate(" + (att.margin.left + (local._width * 0.5)) + ", " + (local._height + att.margin.top + local._margin.bottom - this.getBBox().height) + ")"; });
    	}

		if(att.yLabel){
			chart.select(".yLabel").attr("transform", "translate(0, " + (att.margin.top + (local._height * 0.5)) + ") rotate(-90)")
				.select('text')
				.text(att.yLabel)
				.call(wrap, local._height);
		}
    }

    xAxis = d3.axisBottom()
	    .scale(local._xScale)
	    .tickSizeInner(-local._height)
		.tickSizeOuter(1)
		.tickPadding(15);

    if(att.xScale === 'linear' || att.xScale === 'date') {
		xAxis.ticks(att.xTicks);
    }

    yAxis = d3.axisLeft()
	    .scale(local._yScale)
	    .tickSizeInner(-local._width)
		.tickSizeOuter(1)
		.tickPadding(10)
		.ticks(att.yTicks);

	chart.select(".x.axis")
		.attr("transform", "translate(" + att.margin.left + ", " + (att.margin.top + local._height) + ")")
		.call(xAxis);

	chart.select(".y.axis")
		.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")")
		.call(yAxis);

	bottom.attr("transform", "translate(" + att.margin.left + "," + att.margin.top + ")");
	draw.attr("transform", "translate(" + att.margin.left + "," + att.margin.top + ")");
}

function parseLabel(d, format, value) {
	return String.format(format, value, d.label, d.id);
}

function parseLabelAlt(d, format, total, value) {
	return String.format(format, d.data, d.label, total, value);
}

function drawKey(d){
	var buildString = '<ul class="key__list">';
	d.forEach(function(dl, il){
		buildString += '<li class="key__key ' + att.colors[il % att.colors.length] + '">'
		buildString += dl.label;
		buildString += '</li>'
	});
	buildString += '</ul>';

	d3.select(att.keySelector).html((data.length > 0) ? buildString : '');
}

function drawKeyAlt(){
	d3.select(att.keySelector).html(drawKeyLevels(0, data));
}

function drawKeyLevels(i, d, uniqueArray){
	var buildString = '';
	var dataLevels = 3 - att.keyLevels;

	if(!uniqueArray){
		uniqueArray = [];
	}

	if(dataLevels >= 3) { dataLevels = 2; }

	if(i < 3){ // 3 is the current max amount of levels
		i += 1;

		d.forEach(function(dl, il){
			var label = (dl.label) ? dl.label : dl.key;
			var check = (i > dataLevels && label && uniqueArray.indexOf(label) === -1);

			if(check && !il){
				buildString = '<ul class="key__list">';
			}

			if(check){
				buildString += '<li class="key__key ' + att.colors[il % att.colors.length] + '">'
				buildString += label;

				uniqueArray.push(label);
			}

			buildString += drawKeyLevels(i, dl.values, uniqueArray);

			if(check){
				buildString += '</li>'
			}

			if(check && il === (d.length - 1)){
				buildString += '</ul>';
			}
		});
	} else {
		d.forEach(function(dl, il){
			var label = (dl.label) ? dl.label : dl.key;
			var check = (i > dataLevels && label && uniqueArray.indexOf(label) === -1);
			
			if(check && !il){
				buildString = '<ul class="key__list">';
			}

			if(check){
				if(uniqueArray.indexOf(label) === -1){
					buildString += '<li class="key__key ' + att.colors[il % att.colors.length] + '">'
					buildString += label;
					buildString += '</li>'

					uniqueArray.push(label);
				}
			}

			if(check && il === (d.length - 1)){
				buildString += '</ul>';
			}
		});
	}

	return buildString;
}

function calculateXAxis(){
	var att = this.store.att, data = this.store.data;

	var calcHeight = 0;
	if(att.autoAxis === 'x'){
		if(att.xLabel){
    		this.store.axisHeight = checkText.call(this, att.xLabel, this.store._width, this.store.svgText);
    	}

		this.store.plotHeight = 0;

		for(var i = 0, ilen = data.length; i < ilen; i++){
    		for(var j = 0, jlen = data[i].values.length; j < jlen; j++){

	    		var holdHeight = checkText.call(this, data[i].values[j].id, this.store.plotWidth, this.store.svgText);

    			if(holdHeight > this.store.plotHeight){
    				this.store.plotHeight = holdHeight;
    			}
    		}
		}

		calcHeight += this.store.axisHeight;
		calcHeight += this.store.plotHeight;
		calcHeight += att.margin.bottom;
	} else {
		calcHeight = att.margin.bottom;
	}

	return calcHeight;
}

function calculateXAxisAlt(){
	var local = this.store, att = local.att, data = local.data;

	var calcHeight = 0;
	if(att.autoAxis === 'x'){
		if(att.xLabel){
    		local.axisHeight = checkText.call(this, att.xLabel, local._width, local.svgText);
    	}

		local.sectionHeight = 0;
		local.groupHeight = 0;
		local.barHeight = 0;

		for(var i = 0, ilen = data.length; i < ilen; i++){
			if(att.displaySection){
    			var holdHeight = checkText.call(this, data[i].label, local.sectionWidth, local.svgText);

    			if(holdHeight > local.sectionHeight){
    				local.sectionHeight = holdHeight;
    			}
    		}

    		for(var j = 0, jlen = data[i].values.length; j < jlen; j++){
    			if(att.displayGroup){
	    			var holdHeight = checkText.call(this, data[i].values[j].label, local.groupWidth, local.svgText);

	    			if(holdHeight > local.groupHeight){
	    				local.groupHeight = holdHeight;
	    			}
	    		}

	    		for(var k = 0, klen = data[i].values[j].values.length; k < klen; k++){
	    			if(att.displayBar){
		    			var holdHeight = checkText.call(this, data[i].values[j].values[k].values[0].label, local.barWidth, local.svgText);

		    			if(holdHeight > local.barHeight){
		    				local.barHeight = holdHeight;
		    			}
		    		}
	    		}
    		}
		}

		calcHeight += local.axisHeight;
		calcHeight += local.sectionHeight;
		calcHeight += local.groupHeight;
		calcHeight += local.barHeight;
		calcHeight += att.margin.bottom;
	} else {
		calcHeight = att.margin.bottom;
	}

	return calcHeight;
}

function calculateYAxis(){
	var att = this.store.att, data = this.store.data;

	var calcHeight = att.margin.left;

	if(att.autoAxis === 'y'){
		
	}

	return calcHeight;
}

function checkText(text, tempWidth, foreign){
	var chart = this.store.chart, _spacePadding = this.store._spacePadding;

	var holdHeight = 0;

	if(!foreign){
		chart.append("svg:foreignObject")
			.attr('class', 'tempRemove')
		    .attr("width", tempWidth)
		    .append("xhtml:div")
            .html(text)
            .each(function(){
	        	holdHeight = this.clientHeight + _spacePadding;
	        });

        chart.select('.tempRemove')
        	.remove();
	} else {
		chart.append('text')	
    		.attr('y', '1em')
			.attr('x', 0)
			.text(text)
			.call(wrap, tempWidth)
			.each(function(){
				holdHeight = this.getBBox().height + _spacePadding;
			})
			.remove();
	}

	return holdHeight;
}

function p(x,y){
	return x+" "+y+" ";
}

function roundedRect(x, y, w, h, r1, r2, r3, r4){
	var strPath = "M"+p(x+r1,y); //A
	strPath+="L"+p(x+w-r2,y)+"Q"+p(x+w,y)+p(x+w,y+r2); //B
	strPath+="L"+p(x+w,y+h-r3)+"Q"+p(x+w,y+h)+p(x+w-r3,y+h); //C
	strPath+="L"+p(x+r4,y+h)+"Q"+p(x,y+h)+p(x,y+h-r4); //D
	strPath+="L"+p(x,y+r1)+"Q"+p(x,y)+p(x+r1,y); //A
	strPath+="Z";

	return strPath;
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0;//parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1){
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function midAngle(d, startAngle) {
    return (d.startAngle + (startAngle * (Math.PI/180))) + (d.endAngle - d.startAngle) / 2;
}

function getSectionIndex(i){
	return ((att.sectionOrder) ? att.sectionOrder[i] : i);
}

function getGroupIndex(i){
	return ((att.groupOrder) ? att.groupOrder[i] : i);
}

function getBarIndex(i){
	return ((att.barOrder) ? att.barOrder[i] : i);
}

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return String(format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    }));
  };
}

if (!String.formatKeys) {
  String.formatKeys = function(format) {
    var args = arguments[1];
    return String(format.replace(/{(\w+)}/g, function(match, key) { 
      return typeof args[key] != 'undefined'
        ? args[key] 
        : match
      ;
    }));
  };
}

function att (value) {
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

function data (value) {
	if (!arguments.length) return this.store.data;
	this.store.data = value;
	return this;
};