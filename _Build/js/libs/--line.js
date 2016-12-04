function Line(selector, svgText){
	if(!selector){
		return null;
	}

	if (!(this instanceof Line)) { 
		return new Line(selector);
	}

	this.store = {
		data : [],
		parseDate : null,
		_height : 0,
		_width : 0,
		_spacePadding : 0,
		_margin : {
			bottom: 0,
			left: 0
		},
		draw : null,
		bottom : null,
		xScale : null,
		yScale : null,
		axisHeight : 0,
		plotHeight : 0,
		plotWidth : 0,
		xAxis : null,
		yAxis : null,
		svgText: svgText
	};

	if(typeof selector === 'string'){
		this.store.chart = d3.selectAll(selector);
	} else {
		this.store.chart = d3.select(selector);
	}

	this.store.att = {
		margin : {top: 10, right: 10, bottom: 10, left: 40},
		padding : {outer: 0},
		width : 768,
		height : 432,
		transitionSpeed : 800,
		delaySpeed : 0,
		stagger : 0,
		labelPadding: 10,
		labelPosition: 'top', // bottom
		labelWidth: 'auto', // different depending on scale // set as explicit integer
		spacePadding : 0.6,
		labelFormat : "{1}", // {0}value {1}label {2}id
		aspectRatio : 0.5625,
		colors : ['fill1', 'fill2', 'fill3', 'fill4', 'fill5', 'fill6'], 
		yLabel : null,
        xLabel : null,
        xMin : null,
        xMax : null,
        yMin : null,
		yMax : null,
		flipYAxis : false,
		autoAxis : 'x',
		interpolation : 'linear', // https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate for more options,
		symbols : true,
		symbolSize : 100,
		symbolType : 'circle',
		transitionType : 'cubic-in-out',
		keySelector: '.key',
		xTicks : 10,
		yTicks : 10,
		roundPoints: true,
		dashedLine : 0, // 0 means sold, '3, 3' would be 3 pixels sold 3 pixels gap and so on
		dateFormat : "%d/%m/%Y",
		xScale : null, // null = ordinal // 'date' = timescale // 'linear' = linear // provide function for custom
		plotXValue : null, // null = d.id // 'date' = parseDate(d.id) // provide function for custom
		plotYValue : null // value: 40 = plotYValue: null // value: {weight: 40} = plotYValue: "weight"
	};

	setupBase.call(this);
}

Line.prototype.render = function(){
	var att = this.store.att, data = this.store.data, chart = this.store.chart;

	if(!this.store.parseDate){
		this.store.parseDate = d3.time.format(att.dateFormat).parse;
	}

	updateViewBox();

	var fontSize = parseFloat(chart.style('font-size'));

	// Flip this order to calc auto y
	_width = att.width - att.margin.left - att.margin.right;
	_spacePadding = att.spacePadding * fontSize;

	createXScale();

	_margin.bottom = calculateXAxis();

	_height = att.height - att.margin.top - _margin.bottom;

	createYScale();

	_margin.left = calculateYAxis();

	renderAxis();

	drawKey(data);
	// Flip this order to calc auto y

	var line = d3.svg.line()
		.interpolate(att.interpolation)
		.defined(function(d) { return d.value !== null; })
	    .x(function(d) { return xScale(getXValue(d)); })
	    .y(function(d) { return yScale(getYValue(d)); });

	var lines = draw.selectAll(".line").data(data);

	var gLines = lines.enter().append('g').attr('class', 'line');

	gLines.append("path")
		.attr('class', function (d, i) { return 'line__stroke ' + att.colors[i % att.colors.length] + '-stroked'; });

	lines.select("path")
		.attr("d", function(d){ return line(d.values); })
		.attr("stroke-dasharray", function(d, i){ if(!d.dashedLine && !att.dashedLine){ return this.getTotalLength() + " " + this.getTotalLength(); } return (d.dashedLine) ? d.dashedLine : att.dashedLine; })
			.attr("stroke-dashoffset", function(d, i){ if(!d.dashedLine && !att.dashedLine){ return this.getTotalLength(); } return 0; })
		.transition()
		.ease(att.transitionType)
		.delay(function(d, i) {return (i * att.stagger) + att.delaySpeed; })
		.duration(att.transitionSpeed)
		.ease("linear")
		.attr("stroke-dashoffset", 0);

	lines.exit()
		.style("opacity", 0)
		.remove();

	lines.each(function(lineData, lineIndex) {

		var plots = d3.select(this).selectAll(".plots").data(lineData.values);
			
		var g_Plots = plots.enter()
			.append("g")
			.attr("class", "plots");
		
		if(!svgText) {
			g_Plots.append("svg:foreignObject")
				.attr("opacity", 0)
			    .attr("width", plotWidth)
			    .attr("class", "plotLabel")
			    .append("xhtml:div")
	            .html(function(d) {return d.label;});

            plots.select('.plotLabel')
				.transition()
				.ease(att.transitionType)
				.delay(function(d, i) { return (lineIndex * att.stagger) + att.delaySpeed + ((att.transitionSpeed / lineData.values.length) * i); })
				.duration(att.transitionSpeed)
				.attr('opacity', function(d){
					if(!getYValue(d)){
						return 0;
					}

					return 1;
				});

	        plots.select('.plotLabel div')
				.each(function(d, i){
		        	d3.select(this.parentNode).attr("height", this.clientHeight);

		        	if(att.labelPosition === 'bottom'){
		        		d3.select(this.parentNode).attr("transform", "translate(" + (xScale(getXValue(d)) - (this.clientWidth * 0.5)) + ", " + (yScale(+getYValue(d)) + att.labelPadding) + ")");
		        	} else {
		        		d3.select(this.parentNode).attr("transform", "translate(" + (xScale(getXValue(d)) - (this.clientWidth * 0.5)) + ", " + ((yScale(+getYValue(d)) - att.labelPadding) - this.clientHeight) + ")");
		        	}
		        });
	    } else {
	    	g_Plots.append("text")
				.attr("y", '1em')
				.attr("x", 0)
				.attr('opacity', 0);

			plots.select('text')
				.attr("transform", function(d, i){ return "translate(" + xScale(getXValue(d)) + ", " + (yScale(+getYValue(d)) + att.labelPadding) + ")"; })
				.style('text-anchor', function(d, i){ 
					if((_width - xScale(getXValue(d))) < _width * 0.2){ return 'end'; } 
					if((_width - xScale(getXValue(d))) > _width * 0.8){ return 'start'; } 
					return 'middle'; })
				.text(function(d, i){ return parseLabel(d); })
				.call(wrap, 50)
				.transition()
				.ease(att.transitionType)
				.delay(function(d, i) { return (lineIndex * att.stagger) + att.delaySpeed + ((att.transitionSpeed / lineData.values.length) * i); })
				.duration(att.transitionSpeed)
				.attr('opacity', function(d){
					if(!getYValue(d)){
						return 0;
					}

					return 1;
				});
	    }

		if(att.symbols){
			g_Plots.append("path")
				.attr("class", function(d, i){return 'line__symbol ' + att.colors[(lineIndex % att.colors.length)]})
				.attr('opacity', 0);

			plots.select("path")
				.attr("transform", function(d) { return "translate(" + xScale(getXValue(d)) + "," + yScale(getYValue(d)) + ")"; })
				.attr("d", d3.svg.symbol().type(function(d, i){ 
						return (d.symbolType) ? d.symbolType : (lineData.symbolType) ? lineData.symbolType : att.symbolType; 
					}).size(att.symbolSize))
				.transition()
				.delay(function(d, i) { return (lineIndex * att.stagger) + att.delaySpeed + ((att.transitionSpeed / lineData.values.length) * i); })
				.duration(att.transitionSpeed * 0.5)
				.ease(att.transitionType)
				.attr('opacity', function(d){
					if(!getYValue(d)){
						return 0;
					}

					return 1;
				});
		}

		plots.exit()
    		.style("opacity", 0)
    		.remove();
	});

    return this;
};

Line.prototype.data = function(value) {
	if (!arguments.length) return this.store.data;
	this.store.data = value;
	return this;
};

Line.prototype.att = function (value) {
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

function getYValue(d){
	return (!att.plotYValue) ? d.value : d.value[att.plotYValue];
}

function getXValue(d){
	if(att.plotXValue === null) {
		return d.id;
	} else if(att.plotXValue === 'date') {
		return parseDate(d.id);
	} else {
		return att.plotXValue(d.id);
	}
}

function createXScale(){
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
    	xScale = d3.scale.ordinal()
		    .domain(combine.map(function(d){return d.id;}));

    	if(att.roundPoints){
			xScale.rangeRoundPoints([0, _width], att.padding.outer);
    	} else {
    		xScale.rangePoints([0, _width], att.padding.outer);
    	}

    	if(att.labelWidth === 'auto'){
    		plotWidth = (xScale.range()[1] - xScale.range()[0]);
    	} else {
    		plotWidth = +att.labelWidth;
    	}

    } else if(att.xScale === 'date') {
    	xScale = d3.time.scale()
			.domain([
				(att.xMin) ? parseDate(att.xMin) : d3.min(combine, function(d){ return parseDate(d.id); }), 
				(att.xMax) ? parseDate(att.xMax) : d3.max(combine, function(d){ return parseDate(d.id); })
				])
			.nice(d3.time.week)
			.range([0, _width]);

		if(att.labelWidth === 'auto'){
    		plotWidth = (xScale.range()[1] - xScale.range()[0]);
    	} else {
    		plotWidth = +att.labelWidth;
    	}

    } else if(att.xScale === 'linear') {
		xScale = d3.scale.linear()
		    .domain([
				(att.xMin) ? att.xMin : d3.min(combine, function(d){ return +d.id; }), 
				(att.xMax) ? att.xMax : d3.max(combine, function(d){ return +d.id; })
				])
		    .range([0, _width]);

	    if(att.labelWidth === 'auto'){
    		plotWidth = xScale.range()[1] / data[0].values.length;
    	} else {
    		plotWidth = +att.labelWidth;
    	}

    } else {
    	xScale = att.xScale(att, data);
    }
}

function createYScale(){
	yScale = d3.scale.linear()
	    .domain([
			(att.yMin) ? att.yMin : d3.min(data, function(d) { return d3.min(d.values, function(d) { return +getYValue(d); }); }),
			(att.yMax) ? att.yMax : d3.max(data, function(d) { return d3.max(d.values, function(d) { return +getYValue(d); }); })
			])
	    .range((att.flipYAxis) ? [0, _height] : [_height, 0]);
}

function renderAxis() {
	if(!svgText) {
    	if(att.xLabel){
    		chart.select(".xLabel")
    			.attr("transform", "translate(0, 0)")
			    .attr("width", _width)
			    .select('div')
		        .html(att.xLabel)
		        .each(function(){
		        	d3.select(this.parentNode).attr("height", this.clientHeight)
		        	d3.select(this.parentNode).attr("transform", "translate(" + (att.margin.left) + ", " + (_height + att.margin.top + _margin.bottom - this.clientHeight) + ")")
		        });
    	}

    	if(att.yLabel){
    		chart.select(".yLabel")
				.attr("transform", "translate(0, " + (att.margin.top + _height) + ") rotate(-90)")
			    .attr("width", _height)
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
				.call(wrap, _width)
				.attr("transform", function(){ return "translate(" + (att.margin.left + (_width * 0.5)) + ", " + (_height + att.margin.top + _margin.bottom - this.getBBox().height) + ")"; });
    	}

		if(att.yLabel){
			chart.select(".yLabel").attr("transform", "translate(0, " + (att.margin.top + (_height * 0.5)) + ") rotate(-90)")
				.select('text')
				.text(att.yLabel)
				.call(wrap, _height);
		}
    }

    xAxis = d3.svg.axis()
	    .scale(xScale)
	    .innerTickSize(-_height)
		.outerTickSize(1)
		.tickPadding(15)
	    .orient("bottom");

    if(att.xScale === 'linear') {
		xAxis.tickValues( xScale.ticks(att.xTicks).concat( xScale.domain() ) )
    } else {
    	xAxis.ticks(att.xTicks);
    }

    yAxis = d3.svg.axis()
	    .scale(yScale)
	    .innerTickSize(-_width)
		.outerTickSize(1)
		.tickPadding(10)
		.ticks(att.yTicks)
	    .orient("left");

	chart.select(".x.axis")
		.attr("transform", "translate(" + att.margin.left + ", " + (att.margin.top + _height) + ")")
		.call(xAxis);

	chart.select(".y.axis")
		.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")")
		.call(yAxis);

	bottom.attr("transform", "translate(" + att.margin.left + "," + att.margin.top + ")");
	draw.attr("transform", "translate(" + att.margin.left + "," + att.margin.top + ")");
}

function parseLabel(d) {
	return String.format(att.labelFormat, getYValue(d), d.label, d.id);
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

function calculateXAxis(){
	var calcHeight = 0;
	if(att.autoAxis === 'x'){
		if(att.xLabel){
    		axisHeight = checkText(att.xLabel, _width, svgText);
    	}

		plotHeight = 0;

		for(var i = 0, ilen = data.length; i < ilen; i++){
    		for(var j = 0, jlen = data[i].values.length; j < jlen; j++){

	    		var holdHeight = checkText(data[i].values[j].id, plotWidth, svgText);

    			if(holdHeight > plotHeight){
    				plotHeight = holdHeight;
    			}
    		}
		}

		calcHeight += axisHeight;
		calcHeight += plotHeight;
	} else {
		calcHeight = att.margin.bottom;
	}

	return calcHeight;
}

function calculateYAxis(){
	var calcHeight = att.margin.left;

	if(att.autoAxis === 'y'){
		
	}

	return calcHeight;
}

function checkText(text, tempWidth, foreign){
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