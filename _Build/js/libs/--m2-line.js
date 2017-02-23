function Line(selector, svgText, dateFormat){
	if(!selector){
		return null;
	}

	if (!(this instanceof Line)) { 
		return new Line(selector, svgText);
	}

	this.store = {
		data : [],
		_height : 0,
		_width : 0,
		_spacePadding : 0,
		_margin : {
			bottom: 0,
			left: 0
		},
		_xScale : null,
		_yScale : null,
		draw : null,
		bottom : null,
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
		margin : {top: 10, right: 10, bottom: 0, left: 40},
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
		interpolation : 'Linear', // https://github.com/d3/d3-shape/blob/master/README.md#curves for more options,
		symbols : true,
		symbolSize : 25,
		symbolType : 'Circle',
		transitionType : 'Linear', // https://github.com/d3/d3/blob/master/CHANGES.md#easings-d3-ease
		keySelector: '.key',
		xTicks : 10,
		yTicks : 10,
		roundPoints: true,
		dashedLine : 0, // 0 means solid, '3, 3' would be 3 pixels sold 3 pixels gap and so on
		dateFormat : "%d/%m/%Y",
		xScale : null, // null = ordinal // 'date' = timescale // 'linear' = linear // provide function for custom
		plotXValue : null, // null = d.id // provide function for custom
		plotYValue : null, // value: 40 = plotYValue: null // value: {weight: 40} = plotYValue: "weight"
		parseDate : null
	};

	if(dateFormat){
		this.store.att.parseDate = d3.timeParse(dateFormat);
	} else {
		this.store.att.parseDate = d3.timeParse("%d/%m/%Y");
	}

	setupBase.call(this);
}

Line.prototype.render = function(){
	var local = this.store, att = local.att, data = local.data, chart = local.chart, _this = this;

	updateViewBox.call(this);

	var fontSize = parseFloat(chart.style('font-size'));

	// Flip this order to calc auto y
	local._width = att.width - att.margin.left - att.margin.right;
	local._spacePadding = att.spacePadding * fontSize;

	createXScale.call(this);

	local._margin.bottom = calculateXAxis.call(this);

	local._height = att.height - att.margin.top - local._margin.bottom;

	createYScale.call(this);

	local._margin.left = calculateYAxis.call(this);

	renderAxis.call(this);

	//drawKey(data);
	// Flip this order to calc auto y

	var line = d3.line()
		.curve(d3['curve' + att.interpolation])
		.defined(function(d) { return d.value !== null; })
	    .x(function(d) { return local._xScale(getXValue.call(_this, d)); })
	    .y(function(d) { return local._yScale(getYValue(d, att.plotYValue)); });


	var lines = draw.selectAll(".line").data(data);

	var gLines = lines.enter().append('g').attr('class', 'line');

	gLines.append("path")
		.attr('class', function (d, i) { 
			return 'line__stroke ' + att.colors[i % att.colors.length] + '-stroked'; 
		});

	gLines.merge(lines)
		.select('path')
		.attr("d", function(d){ return line(d.values); })
		.attr("stroke-dasharray", function(d, i){ 
			if(!d.dashedLine && !att.dashedLine){ 
				return this.getTotalLength() + " " + this.getTotalLength(); 
			} 

			return (d.dashedLine) ? d.dashedLine : att.dashedLine; 
		})
		.attr("stroke-dashoffset", function(d, i){ 
			if(!d.dashedLine && !att.dashedLine){ 
				return this.getTotalLength(); 
			} 

			return 0; 
		})
		.transition()
		.ease(d3['ease' + att.transitionType])
		.delay(function(d, i) {
			return (i * att.stagger) + att.delaySpeed; 
		})
		.duration(att.transitionSpeed)
		.attr("stroke-dashoffset", 0);

	lines.exit()
		.style("opacity", 0)
		.remove();

	gLines.each(function(lineData, lineIndex) {

		var plots = d3.select(this).selectAll(".plots").data(lineData.values);
			
		var g_Plots = plots.enter()
			.append("g")
			.attr("class", "plots");
		
		if(!local.svgText) {
			g_Plots.append("svg:foreignObject")
				.attr("opacity", 0)
			    .attr("width", local.plotWidth)
			    .attr("class", "plotLabel")
			    .append("xhtml:div")
	            .html(function(d) {return parseLabel(d, att.labelFormat, getYValue(d, att.plotYValue)) ;});

            g_Plots.merge(plots).select('.plotLabel')
				.transition()
				.ease(d3['ease' + att.transitionType])
				.delay(function(d, i) { return (lineIndex * att.stagger) + att.delaySpeed + ((att.transitionSpeed / lineData.values.length) * i); })
				.duration(att.transitionSpeed)
				.attr('opacity', function(d){
					if(!getYValue(d, att.plotYValue)){
						return 0;
					}

					return 1;
				});

	        g_Plots.merge(plots).select('.plotLabel div')
				.each(function(d, i){
		        	d3.select(this.parentNode).attr("height", this.clientHeight);

		        	if(att.labelPosition === 'bottom'){
		        		d3.select(this.parentNode).attr("transform", "translate(" + (local._xScale(getXValue.call(_this, d)) - (this.clientWidth * 0.5)) + ", " + (local._yScale(+getYValue(d, att.plotYValue)) + att.labelPadding) + ")");
		        	} else {
		        		d3.select(this.parentNode).attr("transform", "translate(" + (local._xScale(getXValue.call(_this, d)) - (this.clientWidth * 0.5)) + ", " + ((local._yScale(+getYValue(d, att.plotYValue)) - att.labelPadding) - this.clientHeight) + ")");
		        	}
		        });
	    } else {
	    	g_Plots.append("text")
				.attr("y", '1em')
				.attr("x", 0)
				.attr('opacity', 0);

			g_Plots.merge(plots).select('text')
				.style('text-anchor', function(d, i){ 
					if((local._width - local._xScale(getXValue.call(_this, d))) < local._width * 0.2){ return 'end'; } 
					if((local._width - local._xScale(getXValue.call(_this, d))) > local._width * 0.8){ return 'start'; } 
					return 'middle'; })
				.text(function(d, i){ return parseLabel(d, att.labelFormat, getYValue(d, att.plotYValue)); })
				.call(wrap, local.plotWidth)
				.attr("transform", function(d, i){ 
					if(att.labelPosition === 'bottom'){
		        		return "translate(" + local._xScale(getXValue.call(_this, d)) + ", " + (local._yScale(+getYValue(d, att.plotYValue)) + att.labelPadding) + ")"; 
		        	} else {
		        		return "translate(" + local._xScale(getXValue.call(_this, d)) + ", " + (local._yScale(+getYValue(d, att.plotYValue)) - att.labelPadding - this.getBBox().height) + ")"; 
		        	}
				})
				.transition()
				.ease(d3['ease' + att.transitionType])
				.delay(function(d, i) { return (lineIndex * att.stagger) + att.delaySpeed + ((att.transitionSpeed / lineData.values.length) * i); })
				.duration(att.transitionSpeed)
				.attr('opacity', function(d){
					if(!getYValue(d, att.plotYValue)){
						return 0;
					}

					return 1;
				});
	    }

		if(att.symbols){
			g_Plots.append("path")
				.attr("class", function(d, i){
					return 'line__symbol ' + ((d.color) ? d.color : att.colors[(lineIndex % att.colors.length)]);
				})
				.attr('opacity', 0);

			g_Plots.merge(plots).select("path")
				.attr("transform", function(d) { return "translate(" + local._xScale(getXValue.call(_this, d)) + "," + local._yScale(getYValue(d, att.plotYValue)) + ")"; })
				.attr("d", d3.symbol()
					.type(function(d, i){ 
						return d3['symbol' + ((d.symbolType) ? d.symbolType : (lineData.symbolType) ? lineData.symbolType : att.symbolType)]; 
					})
					.size(att.symbolSize)
				)
				.transition()
				.delay(function(d, i) { return (lineIndex * att.stagger) + att.delaySpeed + ((att.transitionSpeed / lineData.values.length) * i); })
				.duration(att.transitionSpeed * 0.5)
				.ease(d3['ease' + att.transitionType])
				.attr('opacity', function(d){
					if(!getYValue(d, att.plotYValue)){
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

Line.prototype.data = data;
Line.prototype.att = att;