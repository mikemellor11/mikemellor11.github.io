function createLine(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var data = []; 	// Required //
					// xAxis:num - yAxis:num - size:num //
					
					// Optional //
					// label:string //

	var att = {
		margin : {top: 10, right: 10, bottom: 30, left: 75},
		padding : {outer: 0},
		width : 768,
		height : 432,
		transitionSpeed : 800,
		delaySpeed : 800,
		stagger : 200,
		labelPadding: 10,
		labelFormat : "{1}", // {0}value {1}label {2}id
		aspectRatio : 0.5625,
		colors : ['fill1', 'fill2', 'fill3', 'fill4', 'fill5', 'fill6'], 
		yLabel : null,
        xLabel : null,
        yMin : null,
		yMax : null,
		foreignObjects: false,
		flipYAxis: false,
		autoAxis: 'x',
		interpolation: 'linear', // https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate for more options,
		symbols: true,
		symbolSize: 100,
		symbolType: 'circle',
		transitionType: 'cubic-in-out',
		ticks: 10,
		dashedLine: 0 // 0 means sold, '3, 3' would be 3 pixels sold 3 pixels gap and so on
	};

	/* Local Scope */
	var _height,
		_width,
		_margin = {
			bottom: 0,
			left: 0
		},
		draw,
		bottom,
		xScale,
		yScale;

	setupBase();

	function my(){
		updateViewBox();

		// Flip this order to calc auto y
		_width = att.width - att.margin.left - att.margin.right;

		_margin.bottom = calculateXAxis();

		_height = att.height - att.margin.top - _margin.bottom;

		renderAxis();
		// Flip this order to calc auto y

		var line = d3.svg.line()
			.interpolate(att.interpolation)
			.defined(function(d) { return d.value !== null; })
		    .x(function(d) { return xScale(d.id); })
		    .y(function(d) { return yScale(d.value); });

		var lines = draw.selectAll(".line").data(data);

		var gLines = lines.enter().append('g').attr('class', 'line');

		gLines.append("path")
			.attr('class', function (d, i) { return 'line__stroke ' + att.colors[i % att.colors.length] + '-stroked'; })
			.style("stroke-dasharray", function(d, i){ return (d.dashedLine) ? d.dashedLine : att.dashedLine; })
			.attr("d", function(d){ return line(d.values); });

		lines.exit()
			.transition()
			.duration(att.transitionSpeed)
    		.style("opacity", 0)
    		.remove();

		lines.each(function(lineData, lineIndex) {

			var plots = d3.select(this).selectAll(".plots").data(lineData.values);
				
			var g_Plots = plots.enter()
				.append("g")
				.attr("class", "plots");
			
			if(att.foreignObjects) {
		    } else {
		    	g_Plots.append("text")
					.attr("y", '1em')
					.attr("x", 0)
					.attr("transform", function(d, i){ return "translate(" + xScale(d.id) + ", " + (yScale(+d.value) + att.labelPadding) + ")"; })
					.style('text-anchor', function(d, i){ 
						if((_width - xScale(d.id)) < _width * 0.2){ return 'end'; } 
						if((_width - xScale(d.id)) > _width * 0.8){ return 'start'; } 
						return 'middle'; })
					.attr('opacity', 0);

				plots.select('text')
					.text(function(d, i){ return parseLabel(d); })
					.call(wrap, 50)
					.transition()
					.delay(function(d, i) {return (i * att.stagger) + att.delaySpeed; })
					.duration(att.transitionSpeed)
					.attr('opacity', function(d){
						if(!d.value){
							return 0;
						}

						return 1;
					});
		    }

			if(att.symbols){
				g_Plots.append("path")
					.attr("class", function(d, i){return 'line__symbol ' + att.colors[(lineIndex % att.colors.length)]})
					.attr("d", d3.svg.symbol().size(0))
					.attr("transform", function(d) { return "translate(" + xScale(d.id) + "," + yScale(d.value) + ")"; })
					.attr('opacity', 0);

				plots.select(".line__symbol")
					.transition()
					.delay(function(d, i) {return (i * att.stagger) + att.delaySpeed; })
					.duration(att.transitionSpeed)
					.ease(att.transitionType)
					.attr("d", d3.svg.symbol().type(function(d, i){ 
						return (d.symbolType) ? d.symbolType : (lineData.symbolType) ? lineData.symbolType : att.symbolType; 
					}).size(att.symbolSize))
					.attr("transform", function(d) { return "translate(" + xScale(d.id) + "," + yScale(d.value) + ")"; })
					.attr('opacity', function(d){
						if(!d.value){
							return 0;
						}

						return 1;
					});
			}

			plots.exit()
				.transition()
				.duration(att.transitionSpeed)
	    		.style("opacity", 0)
	    		.remove();
		});
	}

	function renderAxis() {
		chart.select(".yLabel")
			.attr("transform", "translate(0, " + (att.margin.top + (_height * 0.5)) + ") rotate(-90)")
			.select('text')
			.text(att.yLabel)
			.call(wrap, _height);

		chart.select(".xLabel")
			.select('text')
			.text(att.xLabel)
			.call(wrap, _width)
			.attr("transform", function(){ return "translate(" + (att.margin.left + (_width * 0.5)) + ", " + (_height + att.margin.top + _margin.bottom - this.getBBox().height) + ")"; });


		// Loop over data/values, put all id's into single array, then map to xScale below
	    var combine = [];
	    data.forEach(function(d){
	    	combine.push(d.values);
	    });

	    xScale = d3.scale.ordinal()
		    .domain([].concat.apply([], combine).map(function(d){return d.id;}))
		    .rangeRoundPoints([0, _width], att.padding.outer);

		yScale = d3.scale.linear()
		    .domain([
				(att.yMin) ? att.yMin : d3.min(data, function(d) { return d3.min(d.values, function(d) { return +d.value; }); }),
				(att.yMax) ? att.yMax : d3.max(data, function(d) { return d3.max(d.values, function(d) { return +d.value; }); })])
		    .range((att.flipYAxis) ? [0, _height] : [_height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(xScale)
		    .innerTickSize(-_height)
    		.outerTickSize(1)
    		.tickPadding(10)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(yScale)
		    .innerTickSize(-_width)
    		.outerTickSize(1)
    		.tickPadding(10)
    		.ticks(att.ticks)
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

	function setupBase(){
		updateViewBox();

		chart.append("g")
			.attr("class", "yLabel")
			.append("text")
			.attr('y', '1em')
			.attr('x', 0);

		chart.append("g")
			.attr("class", "xLabel")
			.append("text")
			.attr('y', '0.8em')
			.attr('x', 0);

		chart.append("g").attr("class", "x axis");
		chart.append("g").attr("class", "y axis");

		bottom = chart.append("g").attr("class", "bottom");
		draw = chart.append("g").attr("class", "draw");
	}

	function updateViewBox(){
		att.height = (att.width * att.aspectRatio);
		chart.attr("viewBox", "0 0 " + att.width + " " + att.height);
	}

	function parseLabel(d) {
		return String.format(att.labelFormat, d.value, d.label, d.id);
	}

	function calculateXAxis(){
		var calcHeight = 0;
		if(att.autoAxis === 'x'){
			if(att.foreignObjects) { // TODO, add foreign object support

		    } else {
		    	if(att.xLabel){
		    		calcHeight += +checkText(att.xLabel, _width);
		    	}
		    }

		    calcHeight += att.margin.bottom;
		} else {
			calcHeight = att.margin.bottom;
		}

		return calcHeight;
	}

	function checkText(text, tempWidth){
		var holdHeight = 0;

		chart.append('text')	
    		.attr('y', '1em')
			.attr('x', 0)
			.text(text)
			.call(wrap, tempWidth)
			.each(function(){
				holdHeight = this.getBBox().height;
			})
			.remove();

		return holdHeight;
	}

	my.width = function(value) {
		if (!arguments.length) return att.width;
		att.width = value;
		return my;
	};

	my.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		return my;
	};

	my.stagger = function(value) {
		if (!arguments.length) return att.stagger;
		att.stagger = value;
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