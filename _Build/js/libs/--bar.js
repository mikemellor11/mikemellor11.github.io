function Bar(selector, svgText){
	if(!selector){
		return null;
	}

	if (!(this instanceof Bar)) { 
		return new Bar(selector, svgText);
	}

	this.store = {
		data : [],
		dataLast : {},
		parseDate : null,
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
		top : null,
		tip : null,
		axisHeight : 0,
		sectionHeight : 0,
		groupHeight : 0,
		barHeight : 0,
		sectionWidth : 0,
		groupWidth : 0,
		barWidth : 0,
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
		padding : {right: 0.06, left: 0.06},
		width : 768,
		height : 432,
		barGap : 0.1,
		groupGap : 0.1,
		sectionGap : 0.1,
		transitionSpeed : 800,
		decimalPlaces : 0,
		transitionType: 'CubicInOut',
		delaySpeed : 0,
		stagger : 0,
		cornerRadius : 0.05,
		colors :['fill1', 'fill2', 'fill3', 'fill4', 'fill5', 'fill6', 'fill7'],
		aspectRatio : 0.5625,
		spacePadding : 0.6,
		yMin : null,
		yMax : null,
		displaySection: false,
		displayGroup : false,
		displayBar : false,
		displayTrunk : false,
		trunkFormat: "{0}",
		trunkOutside: false, // label will position inside and outside if no room, set to true to always position outside
		yLabel : null,
        xLabel : null,
        sectionOrder : null,
        groupOrder : null,
        barOrder : null,
        keySelector: '.key',
        keyLevels : 0,
        shadow: false,
        autoAxis: 'x',
        dataLevels: 0,
        showYAxis: true,
        showXAxis: true,
        tip: false,
        ticks: 5,
        markerSize: {
        	"top": {
        		"left": 10,
        		"right": 10
        	},
        	"bottom": {
        		"left": 10,
        		"right": 10
        	}
        },
        accumulativeMinMax: true,
        accumulativeStacked: false,
        displayMarkers: false,
        showBaseline: false, // Looks for baseline boolean on data, draws line across groups
        stackedColorsFade: true // Setting to false will make the colors be selected by trunk index instead of bar index, much more likely for repeats horizontally than vertically
	};

	this.store.chart.attr("viewBox", "0 0 " + this.store.att.width + " " + this.store.att.height);

	if(svgText){
		this.store.chart.append("svg:foreignObject")
			.attr("class", "yLabel")
		    .append("xhtml:div");

		this.store.chart.append("svg:foreignObject")
			.attr("class", "xLabel")
		    .append("xhtml:div");
	} else {
		this.store.chart.append("g")
			.attr("class", "yLabel")
			.append("text")
			.attr('y', '1em')
			.attr('x', 0);

		this.store.chart.append("g")
			.attr("class", "xLabel")
			.append("text")
			.attr('y', '1em')
			.attr('x', 0);
	}

	this.store.chart.append("g")
		.attr("class", "y axis");

	this.store.chart.append("g")
		.attr("class", "x axis")
		.append("line");

	draw = this.store.chart.append("g")
		.attr("class", "draw");

	top = this.store.chart.append("g")
		.attr("class", "top");

	if(this.store.att.tip){
		tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
				console.log(d);
				return "<strong>" + d.key + "</strong>";
			})

		top.call(tip);
	}
}

Bar.prototype.render = function(){
	var local = this.store, att = local.att, data = local.data, chart = local.chart;

	//drawKeyAlt();

	att.height = (att.width * att.aspectRatio);
	chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

	var fontSize = parseFloat(chart.style('font-size'));

	var _padding = {
		right: att.padding.right * att.width,
		left: att.padding.left * att.width
	};

	var calcMax = 0;
	var calcMin = 0;

	if(!att.yMax){
		calcMax = d3.max(data, function(d){
    		return d3.max(d.values, function(d) {
    			return d3.max(d.values, function(d) {
	    			return d3.max(d.values, function(d) {
		    			if(d.max){
		    				if(att.accumulativeMinMax){
		    					return +d.value + +d.max;
		    				} else {
		    					if(+d.value > +d.max){
		    						return +d.value;
		    					}
		    					return +d.max;
		    				}
		    			} else {
		    				return +d.value;
		    			}
		    		});
	    		}); 
    		});
    	});
	} else {
		calcMax = +att.yMax;
	}

    if(!att.yMin){
    	calcMin = d3.min(data, function(d){
    		return d3.min(d.values, function(d) {
    			return d3.min(d.values, function(d) {
	    			return d3.min(d.values, function(d) {
		    			if(d.min){
		    				if(att.accumulativeMinMax){
		    					return +d.value - +d.min;
		    				} else {
		    					if(+d.value < +d.min){
		    						return +d.value;
		    					}
		    					return +d.min;
		    				}
		    			} else {
		    				return +d.value;
		    			}
		    		});
	    		}); 
    		});
    	});
    } else {
    	calcMin = +att.yMin;
    }

	if(calcMin > 0){
    	calcMin = 0;
    }

	var maxBars = d3.max(data, function(d){
    		return d3.max(d.values, function(d) {
    			return d.values.length;
    		});
    	});

	var maxGroup = d3.max(data, function(d){
    		return d.values.length
    	});

	local._width = att.width - att.margin.left - att.margin.right;
	local._spacePadding = att.spacePadding * fontSize;
	var _barGap;
	var _groupGap;
	var _sectionGap;

	_sectionGap = att.sectionGap * local._width;

	sectionWidth = ((local._width - _padding.left - _padding.right - (_sectionGap * (data.length - 1))) / data.length);

	_groupGap = att.groupGap * sectionWidth;

	groupWidth = ((sectionWidth - (_groupGap * (maxGroup - 1))) / maxGroup);

	_barGap = att.barGap * groupWidth;

	barWidth = ((groupWidth - (_barGap * (maxBars - 1))) / maxBars);

	local._margin.bottom = calculateXAxisAlt.call(this);
	local._margin.left = calculateYAxis.call(this);

	local._height = att.height - att.margin.top - local._margin.bottom;

	var y = d3.scaleLinear()
	    .domain([calcMin, calcMax])
	    .range([local._height, 0]);

    if(att.showYAxis){
    	var yAxis = d3.axisLeft()
		    .scale(y)
		    .tickSizeInner(-local._width)
    		.tickSizeOuter(0)
		    .ticks(att.ticks)
		    .tickPadding(10);
    }

    if(!local.svgText) {
    	if(att.xLabel){
    		chart.select(".xLabel")
			    .attr("width", local._width)
			    .select('div')
		        .html(att.xLabel)
		        .each(function(){
		        	d3.select(this.parentNode).attr("height", local.axisHeight)
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

	if(att.showXAxis){
		chart.select(".x.axis line")
			.transition()
			.ease(d3['ease' + att.transitionType])
	    	.duration(att.transitionSpeed)
		    .attr("x1", (att.margin.left - 1))
		    .attr("x2", (att.margin.left + local._width + 1))
		    .attr("y1", (local._height + att.margin.top))
		    .attr("y2", (local._height + att.margin.top));
	}

	if(att.showYAxis){
		chart.select(".y.axis")
			.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")")
			.transition()
			.ease(d3['ease' + att.transitionType])
	    	.duration(att.transitionSpeed)
			.call(yAxis);
	}

	return this;

	// SECTIONS //

	// DATA //
	var sections = draw.selectAll(".sections").data(data, function(d, i){return d.key;});

    // APPENDS //
    var g_Section = sections.enter().append("g")
		.attr('class', 'sections')
		.attr("transform", function(d, i) { return "translate(" + ((getSectionIndex(i) * (sectionWidth + _sectionGap)) + (att.margin.left + _padding.left)) + ", " + att.margin.top + ")"; });

	if(!local.svgText) {
		g_Section.append("svg:foreignObject")
			.attr("opacity", 0)
		    .attr("width", sectionWidth)
		    .attr("class", "sectionLabel")
		    .append("xhtml:div")
            .html(function(d) {return d.label;})
            .each(function(){
	        	d3.select(this.parentNode).attr("height", this.clientHeight)
	        	d3.select(this.parentNode).attr("transform", "translate(0, " + ((local._height + local._margin.bottom) - this.clientHeight - local.axisHeight) + ")")
	        });

        sections.select('.sectionLabel')
        	.attr("width", sectionWidth)
			.transition()
			.ease(d3['ease' + att.transitionType])
			.duration(att.transitionSpeed)
			.attr('opacity', function(){if(att.displaySection){return 1;} return 0;});

		sections.select('.sectionLabel div')
			.html(function(d) {return d.label;})
			.each(function(){
	        	d3.select(this.parentNode).attr("height", this.clientHeight)
	        	d3.select(this.parentNode).attr("transform", "translate(0, " + ((local._height + local._margin.bottom) - this.clientHeight - local.axisHeight) + ")")
	        });
	} else {
		g_Section.append("g")
			.attr("class", "sectionLabel")
			.attr("opacity", 0)
			.append("text")
			.attr('y', "1em")
			.attr('x', 0)
			.text(function(d) {return d.label;})
			.call(wrap, sectionWidth)
			.attr("transform", function(){ return "translate(" + (sectionWidth * 0.5) + ", " + ((local._height + local._margin.bottom) - local.axisHeight - this.getBBox().height) + ")"; });

		sections.select('.sectionLabel')
			.transition()
			.ease(d3['ease' + att.transitionType])
			.duration(att.transitionSpeed)	
			.attr('opacity', function(){if(att.displaySection){return 1;} return 0;});
	}

	// SELECTS //
	sections.transition()
		.ease(d3['ease' + att.transitionType])
		.duration(att.transitionSpeed)
		.style("opacity", 1)
		.attr("transform", function(d, i) {return "translate(" + ((getSectionIndex(i) * (sectionWidth + _sectionGap)) + (att.margin.left + _padding.left)) + ", " + att.margin.top + ")"; });

	sections.exit()
		.transition()
		.ease(d3['ease' + att.transitionType])
		.duration(att.transitionSpeed)
		.style("opacity", 0)
		.remove();

	sections.each(function(sectionData, sectionIndex) {
		// GROUPS //

		// DATA //
		var groups = d3.select(this).selectAll('.groups').data(function(d, i){return d.values;}, function(d, i){return d.key;});

	    // APPENDS //
	    var g_Groups = groups.enter().append("g")
			.attr('class', 'groups')
			/*.attr('font-size', function(){return ((groupWidth * 0.10 > 30)) ? 30 : (groupWidth * 0.10); })*/
			.style("opacity", 0)
			.attr("transform", function(d, i) { return "translate(" + ((getGroupIndex(i) * (groupWidth + _groupGap))) + ", 0)"; })

		if(att.tip){
			g_Groups.on('mouseover', tip.show)
					.on('mouseout', tip.hide);
			}

		if(!local.svgText) {
			g_Groups.append("svg:foreignObject")
				.attr("opacity", 0)
			    .attr("width", groupWidth)
			    .attr("class", "groupLabel")
			    .append("xhtml:div")
	            .html(function(d) {return d.label;})
	            .each(function(){
		        	d3.select(this.parentNode).attr("height", this.clientHeight)
		        	d3.select(this.parentNode).attr("transform", "translate(0, " + ((local._height + local._margin.bottom) - this.clientHeight - local.axisHeight - local.sectionHeight) + ")")
		        });

	        groups.select('.groupLabel')
	        	.attr("width", groupWidth)
				.transition()
				.ease(d3['ease' + att.transitionType])
				.duration(att.transitionSpeed)
				.attr('opacity', function(){if(att.displayGroup){return 1;} return 0;});

			groups.select('.groupLabel div')
				.html(function(d) {return d.label;})
				.each(function(){
		        	d3.select(this.parentNode).attr("height", this.clientHeight)
		        	d3.select(this.parentNode).attr("transform", "translate(0, " + ((local._height + local._margin.bottom) - this.clientHeight - local.axisHeight - local.sectionHeight) + ")")
		        });
		} else {
			g_Groups.append("g")
				.attr("class", "groupLabel")
				.attr("opacity", 0)
				.append("text")
				.attr('y', "1em")
				.attr('x', 0)
				.text(function(d) {return d.label;})
				.call(wrap, groupWidth)
				.attr("transform", function(){ return "translate(" + (groupWidth * 0.5) + ", " + ((local._height + local._margin.bottom) - local.axisHeight - local.sectionHeight - this.getBBox().height) + ")"; });

			groups.select('.groupLabel')
				.text(function(d) {return d.label;})
				.call(wrap, groupWidth)
				.transition()
				.ease(d3['ease' + att.transitionType])
				.duration(att.transitionSpeed)
				.attr('opacity', function(){if(att.displayGroup){return 1;} return 0;});
		}

        // SELECTS //
        groups.transition()
        .ease(d3['ease' + att.transitionType])
			.duration(att.transitionSpeed)
			/*.attr('font-size', function(){return ((groupWidth * 0.10 > 30)) ? 30 : (groupWidth * 0.10); })*/
			.style("opacity", 1)
        	.attr("transform", function(d, i) { return "translate(" + ((getGroupIndex(i) * (groupWidth + _groupGap))) + ", 0)"; });

        groups.exit()
			.transition()
			.ease(d3['ease' + att.transitionType])
	    	.duration(att.transitionSpeed)
	    	.style("opacity", 0)
	    	.remove();

		groups.each(function(groupData, groupIndex) {
			// BARS //

			var calcMaxGroup = d3.max(groupData.values, function(d) {
    			return d3.max(d.values, function(d) {
	    			return +d.value; 
	    		}); 
    		});

			// DATA //
			var bars = d3.select(this).selectAll('.bars').data(function(d, i){return d.values;}, function(d, i){return d.values[0].id;});

		    // APPENDS //
		    var gBars = bars.enter().append("g")
				.attr('class', 'bars')
				.attr("transform", function(d, i) { return "translate(" + ((getBarIndex(i) * (barWidth + _barGap))) + ", 0)"; });

			// SELECTS //
			bars.transition()
			.ease(d3['ease' + att.transitionType])
				.duration(att.transitionSpeed)
				.style("opacity", 1)
	        	.attr("transform", function(d, i) { return "translate(" + ((getBarIndex(i) * (barWidth + _barGap))) + ", 0)"; });

	        bars.exit()
				.transition()
				.ease(d3['ease' + att.transitionType])
				.duration(att.transitionSpeed)
	    		.style("opacity", 0)
	    		.remove();

			bars.each(function(barData, barIndex) {
				// TRUNKS //
				var trunks = d3.select(this).selectAll('.trunks').data(function(d, i){return d.values;}, function(d, i){return d.id});

				// Add a new item used for interpolation of trunkLabel below
				if(!local.dataLast['' + sectionIndex + groupIndex + barIndex]){
					local.dataLast['' + sectionIndex + groupIndex + barIndex] = 0;
				}

		    	trunks.transition()
		    	.ease(d3['ease' + att.transitionType])
			    	.duration(att.transitionSpeed)
			    	.style("opacity", 1);

			    trunks.exit()
					.transition()
					.ease(d3['ease' + att.transitionType])
					.duration(att.transitionSpeed)
		    		.style("opacity", 0)
		    		.remove();

				var g_Trunks = trunks.enter().insert("g", "g")
					.attr('class', 'trunks');

				// BODY //
				g_Trunks.append("path")
					.attr("class", function(d, i){
						if(!att.stackedColorsFade){
							return "body " + att.colors[(i % att.colors.length)];
						}
						return "body " + att.colors[(barIndex % att.colors.length)] + '-stacked' + (i + 1);
					})
					.attr("d", function(d, i) {
				      	return roundedRect(0, y(0), barWidth, 0, 0, 0, 0, 0); // x y width height att.cornerRadius .. .. ..
				    });

				trunks.select('.body')
					.attr("class", function(d, i){
						if(!att.stackedColorsFade){
							return "body " + att.colors[(i % att.colors.length)];
						}
						return "body " + att.colors[(barIndex % att.colors.length)] + '-stacked' + (i + 1);
					})
					.transition()
					.ease(d3['ease' + att.transitionType])
					.delay(function(d, i) {return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
					.duration(att.transitionSpeed)
					.attr("d", function(d, i) {
						var base = +d.value;

						if(att.accumulativeStacked){
							base = 0;
							for(j = 0; j <= i; j++){
								base += +barData.values[j].value;
							}
						}

						var cR = barWidth * att.cornerRadius;
						var tempHeight = Math.abs(y(0) - y(base));
						if(tempHeight < cR) cR = tempHeight;
				      	return (base < 0) ? roundedRect(0, y(0), barWidth, tempHeight, 0, 0, cR, cR) : roundedRect(0, y(base), barWidth, tempHeight, cR, cR, 0, 0);
				    });

				// SHADOW //
				if(att.shadow){
					g_Trunks.append("path")
						.attr("class", function(d, i){return "shadow " + att.colors[(barIndex % att.colors.length)];})
						.attr("opacity", 0.6)
						.attr("d", function(d, i) {
					      	return roundedRect(barWidth, local._height, barWidth * 0.08, 0, 0, 0, 0, 0);
					    });

					trunks.select('.shadow')
						.attr("class", function(d, i){return "shadow " + att.colors[(barIndex % att.colors.length)];})
						.transition()
						.ease(d3['ease' + att.transitionType])
						.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
						.duration(att.transitionSpeed)
						.attr("d", function(d, i) {
							var base = +d.value;
							var cR = (( local._height - y(base)) < (barWidth * att.cornerRadius)) ? ( local._height - y(base)) : barWidth * att.cornerRadius;
							var offsetY = (cR > ((local._height - y(base)) * 0.04)) ? cR : ((local._height - y(base)) * 0.04);
					      	return roundedRect(barWidth, y(base) + offsetY, barWidth * 0.08, local._height - y(base) - offsetY, 0, cR, 0, 0);
					    });
				}

				if(att.displayMarkers){
					g_Trunks.append("line")
						.attr("class", "marker marker__vert")
						.attr("x1", (barWidth * 0.5))
					    .attr("x2", (barWidth * 0.5))
					    .attr("y1", local._height)
					    .attr("y2", local._height);

				    trunks.select('.marker__vert')
						.transition()
						.ease(d3['ease' + att.transitionType])
						.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
						.duration(att.transitionSpeed)
						.attr("y1", function(d, i){
					    	if(att.accumulativeMinMax){
					    		return y(+d.value + +d.max);
					    	}
					    	return y(+d.max);
					    })
					    .attr("y2", function(d, i){
					    	if(att.accumulativeMinMax){
					    		return y(+d.value - +d.min);
					    	}
					    	return y(+d.min);
					    });

					if(att.markerSize.top && (att.markerSize.top.left || att.markerSize.top.right)){
						g_Trunks.append("line")
						    .attr("x1", ((barWidth * 0.5) - ((att.markerSize.top.left) ? att.markerSize.top.left : att.markerSize.top.right)))
						    .attr("x2", ((barWidth * 0.5) + ((att.markerSize.top.right) ? att.markerSize.top.right : att.markerSize.top.left)))
						    .attr("y1", local._height)
						    .attr("y2", local._height)
						    .attr("opacity", 0)
						    .attr("class", "marker marker__horz__top");

					    trunks.select('.marker__horz__top')
							.transition()
							.ease(d3['ease' + att.transitionType])
							.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
							.duration(att.transitionSpeed)
							.attr("y1", function(d, i){
						    	if(att.accumulativeMinMax){
						    		return y(+d.value + +d.max);
						    	}
						    	return y(+d.max);
						    })
						    .attr("y2", function(d, i){
						    	if(att.accumulativeMinMax){
						    		return y(+d.value + +d.max);
						    	}
						    	return y(+d.max);
						    })
							.attr("opacity", 1);
					}
				    
					if(att.markerSize.bottom && (att.markerSize.bottom.left || att.markerSize.bottom.right)){
					    g_Trunks.append("line")
						    .attr("x1", ((barWidth * 0.5) - ((att.markerSize.bottom.left) ? att.markerSize.bottom.left : att.markerSize.bottom.right)))
						    .attr("x2", ((barWidth * 0.5) + ((att.markerSize.bottom.right) ? att.markerSize.bottom.right : att.markerSize.bottom.left)))
						    .attr("y1", local._height)
						    .attr("y2", local._height)
						    .attr("opacity", 0)
						    .attr("class", "marker marker__horz__bottom");

					    trunks.select('.marker__horz__bottom')
							.transition()
							.ease(d3['ease' + att.transitionType])
							.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
							.duration(att.transitionSpeed)
							.attr("y1", function(d, i){
						    	if(att.accumulativeMinMax){
						    		return y(+d.value - +d.min);
						    	}
						    	return y(+d.min);
						    })
						    .attr("y2", function(d, i){
						    	if(att.accumulativeMinMax){
						    		return y(+d.value - +d.min);
						    	}
						    	return y(+d.min);
						    })
							.attr("opacity", 1);
					}
				}

				if(!local.svgText) {
				    // BAR LABEL //
					g_Trunks.append("svg:foreignObject")
						.attr("opacity", 0)
					    .attr("width", barWidth)
					    .attr("class", "barLabel")
					    .append("xhtml:div")
			            .html(function(d) {return d.label;})
			            .each(function(){
				        	d3.select(this.parentNode).attr("height", this.clientHeight)
				        	d3.select(this.parentNode).attr("transform", "translate(0, " + ((local._height + local._margin.bottom) - local.axisHeight - local.sectionHeight - local.groupHeight - local.barHeight + local._spacePadding) + ")")
				        });

					trunks.select('.barLabel')
						.attr("width", barWidth)
						.transition()
						.ease(d3['ease' + att.transitionType])
						.duration(att.transitionSpeed)
						.attr('opacity', function(){if(att.displayBar){return 1;} return 0;})
						.attr("transform", "translate(0, " + ((local._height + local._margin.bottom) - local.axisHeight - local.sectionHeight - local.groupHeight - local.barHeight + local._spacePadding) + ")");

					trunks.select('.barLabel div')
						.html(function(d) {return d.label;})
						.each(function(){
				        	d3.select(this.parentNode).attr("height", this.clientHeight)
				        	d3.select(this.parentNode).attr("transform", "translate(0, " + ((local._height + local._margin.bottom) - local.axisHeight - local.sectionHeight - local.groupHeight - local.barHeight + local._spacePadding) + ")")
				        });
			    } else {
			    	g_Trunks.append("g")
			    		.append("text")
						.attr("class", "barLabel")
						.attr("opacity", 0)
						.attr('y', "1em")
						.attr('x', 0)
						.text(function(d) {return d.label;})
						.call(wrap, barWidth)
						.attr("transform", function(){ return "translate(" + (barWidth * 0.5) + ", " + ((local._height + local._margin.bottom) - local.axisHeight - local.sectionHeight - local.groupHeight - local.barHeight + local._spacePadding) + ")"; });

						trunks.select('.barLabel')
							.text(function(d) {return d.label;})
							.call(wrap, barWidth)
							.transition()
							.ease(d3['ease' + att.transitionType])
							.duration(att.transitionSpeed)
							.attr('opacity', function(){if(att.displayBar){return 1;} return 0;})
							.attr("transform", function(){ return "translate(" + (barWidth * 0.5) + ", " + ((local._height + local._margin.bottom) - local.axisHeight - local.sectionHeight - local.groupHeight - local.barHeight + local._spacePadding) + ")"; });
			    }

			    if(!local.svgText) {
				    // BAR LABEL //
					g_Trunks.append("svg:foreignObject")
						.attr("opacity", 0)
					    .attr("width", barWidth)
					    .attr("class", "numberLabel reverseColor")
					    .attr("transform", function(d, i){ return "translate(0, " + y(0) + ")"; })
					    .style('font-size', function(){return (((barWidth * 0.2 > 30)) ? 30 : (barWidth * 0.2)) + 'px'; })
					    .append("xhtml:div")
			            .html(0)
			            .each(function(d){
				        	d3.select(this.parentNode).attr("height", this.clientHeight)
				        });

					trunks.select('.numberLabel')
						.attr("width", barWidth)
						.attr("class", function(d, i){ 
					    	if(att.trunkOutside || this.getBBox().height > Math.abs(y(0) - y(+d.value))){
					    		return "numberLabel"
					    	}

							return "numberLabel reverseColor";
						})
						.transition()
						.ease(d3['ease' + att.transitionType])
						.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
						.duration(att.transitionSpeed)
						.style('font-size', function(){return (((barWidth * 0.2 > 30)) ? 30 : (barWidth * 0.2)) + 'px'; })
						.attr("transform", function(d, i){
					    	if(att.trunkOutside || this.getBBox().height > Math.abs(y(0) - y(+d.value))){
					    		return "translate(0 , " + (y(+d.value) - this.getBBox().height) + ")"
					    	}

							return "translate(0 , " + y(+d.value) + ")";
						})
					    .attr('opacity', function(d){
							if(att.displayTrunk){
								return 1;
							} 
							return 0;
						});

					trunks.select('.numberLabel div')
						.transition()
						.ease(d3['ease' + att.transitionType])
						.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
						.duration(att.transitionSpeed)
						.tween("html", function(d, i) {
				            var i = d3.interpolate(local.dataLast['' + sectionIndex + groupIndex + barIndex], +d.value);
				            return function(t) {
				            	local.dataLast['' + sectionIndex + groupIndex + barIndex] = parseFloat(i(t)).toFixed(att.decimalPlaces);
				                this.textContent = String.format((d.format) ? d.format : att.trunkFormat, parseFloat(i(t)).toFixed(att.decimalPlaces), Math.round(((parseFloat(i(t)).toFixed(0) / att.totalCount) * 100)), att.totalCount);
				            };
				        });
			    } else {
			    	// NUMBER LABEL //
				    g_Trunks.append("text")
					    .attr("y", function(d, i){ return ((+d.value > 0) ? "1em": "-0.25em"); })
					    .attr("x", 0)
					    .attr("transform", function(d, i){ return "translate(" + (barWidth * 0.5) + ", " + y(0) + ")"; })
					    .attr("class", "numberLabel")
					    .attr("opacity", 0)
					    .style('font-size', function(){return (((barWidth * 0.2 > 30)) ? 30 : (barWidth * 0.2)) + 'px'; })
					    .text(0);

					trunks.select('.numberLabel')
						.transition()
						.ease(d3['ease' + att.transitionType])
						.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
						.duration(att.transitionSpeed)
						.attr("y", function(d, i){ return ((+d.value > 0) ? "1em": "-0.25em"); })
						.style('font-size', function(){return (((barWidth * 0.2 > 30)) ? 30 : (barWidth * 0.2)) + 'px'; })
						.attr("class", function(d, i){ 
					    	if(att.trunkOutside || this.getBBox().height > Math.abs(y(0) - y(+d.value))){
					    		return "numberLabel"
					    	}

							return "numberLabel reverseColor";
						})
						.attr("transform", function(d, i){ 
					    	if(att.trunkOutside || this.getBBox().height > Math.abs(y(0) - y(+d.value))){
					    		return "translate(" + (barWidth * 0.5) + ", " + (y(+d.value) - this.getBBox().height) + ")"
					    	}

							return "translate(" + (barWidth * 0.5) + ", " + y(+d.value) + ")";
						})
					    .attr('opacity', function(d){
							if(att.displayTrunk){
								return 1;
							} 
							return 0;
						})
					    .tween("text", function(d, i) {
				            var i = d3.interpolate(local.dataLast['' + sectionIndex + groupIndex + barIndex], +d.value);
				            return function(t) {
				            	local.dataLast['' + sectionIndex + groupIndex + barIndex] = parseFloat(i(t)).toFixed(att.decimalPlaces);
				                this.textContent = String.format((d.format) ? d.format : att.trunkFormat, parseFloat(i(t)).toFixed(att.decimalPlaces), Math.round(((parseFloat(i(t)).toFixed(0) / att.totalCount) * 100)), att.totalCount);
				            };
				        });
			    }
			});
		});

		if(att.showBaseline){
			g_Groups.append("line")
				.attr("class", "marker baseline")
				.attr("x1", 0)
			    .attr("x2", groupWidth)
			    .attr("y1", function(d, i){
			    	return y(d.values.filter(function(a){
			    		var asdf = a.values.filter(function(a){
			    			return a.baseline;
			    		});

			    		return (asdf.length) ? asdf : false;
			    	})[0].values[0].value);
			    })
			    .attr("y2", function(d, i){
			    	return y(d.values.filter(function(a){
			    		var asdf = a.values.filter(function(a){
			    			return a.baseline;
			    		});

			    		return (asdf.length) ? asdf : false;
			    	})[0].values[0].value);
			    });
		}
	});
}

Bar.prototype.data = function(value) {
	if (!arguments.length) return this.store.data;

	if(this.store.att.dataLevels === 0){
		var createArray = [];
		for(var i = 0, len = value.length; i < len; i++){
			createArray.push(
				{
		            "values": [
		            	value[i]
		            ]
		        }
			);
		}

		this.store.data = [
	        {
	            "key": "Level 1",
	            "values": [
	                {
	                    "key": "Level 2",
	                    "values": createArray
	                }
	            ]
	        }
	    ];
	} else if(this.store.att.dataLevels === 1){
		this.store.data = [
	        {
	            "key": "Level 1",
	            "values": [
	                {
	                    "key": "Level 2",
	                    "values": value
	                }
	            ]
	        }
	    ];
	} else if(this.store.att.dataLevels === 2){
		this.store.data = [
	        {
	            "key": "Level 1",
	            "values": value
	        }
	    ];
	} else {
		this.store.data = value;
	}

	return this;
};
Bar.prototype.att = att;