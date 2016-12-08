function Pie(selector, svgText){
	if(!selector){
		return null;
	}

	if (!(this instanceof Pie)) { 
		return new Pie(selector, svgText);
	}

	this.store = {
		data : [],
		draw : null,
		bottom : null,
		group : null,
		labels : null,
		lines : null,
		arc : null,
		svgText: svgText,
		pie : d3.pie()
		    .sort(null)
		    .value(function(d) {return d.data; })
	};

	if(typeof selector === 'string'){
		this.store.chart = d3.selectAll(selector);
	} else {
		this.store.chart = d3.select(selector);
	}

	this.store.att = {
		width : 740,
		height : 740,
		aspectRatio : 1,
		transitionSpeed : 1200,
		delaySpeed : 0,
		colors : ['fill1', 'fill2', 'fill3', 'fill4', 'fill5'],
		showLabels : false,
		clockwise : true,
		startAngle : 0,
		labelMaxWidth : 120,
		labelPadding : 10,
		labelFormat : "{0} - {1}", // {0}value {1}label {2}total {3}percent
		innerRadius : 0,
		shadow: false,
		stagger : true,
		shadowInnerRadius : 1.05,
		harveyBall : false, // Only pass a single value to work properly
		showCenterPercent : false, // Useful for harvey ball charts
		totalCount : 100, // What the harvey value will be calculated against
		showBase: false, // If true when harvey ball will have the remaining pie filled with harvey color
		centerBackground : false
	}

    this.store.chart.attr("viewBox", "0 0 " + this.store.att.width + " " + this.store.att.height);

    bottom = this.store.chart.append("g")
    	.attr("class", "bottom");
	group = this.store.chart.append("g")
		.attr("class", "slices");
	labels = this.store.chart.append("g")
	    .attr("class", "labels");
	lines = this.store.chart.append("g")
        .attr("class", "lines");

    if(this.store.att.centerBackground){
    	bottom.append("circle").attr("class", "centerBackground reverseColor--alt");
    }

    if(this.store.att.showCenterPercent){
    	bottom.append("text").attr("class", "centerPercent text--alt").text("0%").attr('opacity', 0);	
    }
}

Pie.prototype.render = function(){
	var local = this.store, att = local.att, data = local.data, chart = local.chart;

	var radius = (att.width * 0.5) - ((att.showLabels) ? (att.labelMaxWidth + att.labelPadding) : 0);
	var _transitionSpeed = att.transitionSpeed / data.length;

	if(att.showLabels){
		att.height = att.height - ((att.labelMaxWidth + att.labelPadding) * 2);
		att.aspectRatio = att.height / att.width;
	}

	arc = d3.arc()
	    .outerRadius(radius)
	    .innerRadius(radius * att.innerRadius)
	    .startAngle(function(d) { return d.startAngle + (att.startAngle * (Math.PI/180)); })
        .endAngle(function(d) { return d.endAngle + (att.startAngle * (Math.PI/180)); });

    if(att.shadow){
    	arcShadow = d3.arc()
		    .outerRadius((radius * att.innerRadius) * att.shadowInnerRadius)
	    	.innerRadius(radius * att.innerRadius)
		    .startAngle(function(d) { return d.startAngle + (att.startAngle * (Math.PI/180)); })
            .endAngle(function(d) { return d.endAngle + (att.startAngle * (Math.PI/180)); });
    }

	if (att.showLabels) {
	    var outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)
            .startAngle(function(d) { return d.startAngle + (att.startAngle * (Math.PI/180)); })
        	.endAngle(function(d) { return d.endAngle + (att.startAngle * (Math.PI/180)); });
	}

	bottom.attr("transform", "translate(" + (att.width * 0.5) + "," + (att.height * 0.5) + ")");
	group.attr("transform", "translate(" + (att.width * 0.5) + "," + (att.height * 0.5) + ")");

	if (att.showLabels) {
	    labels.attr("transform", "translate(" + (att.width * 0.5) + "," + (att.height * 0.5) + ")");
	    lines.attr("transform", "translate(" + (att.width * 0.5) + "," + (att.height * 0.5) + ")");
	}

	chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

	if(att.showBase){
		var harvs = bottom.selectAll('.harveyBall').data(function(){return (att.harveyBall) ? local.pie([{data: 1}]) : local.pie([]);});
	
		var gHarvs = harvs.enter()
			.append("g")
			.attr("class", "harveyBall");

		harvs.exit().remove();

		gHarvs.append("path").attr('class', 'harveyBase');

		gHarvs.select('.harveyBase')
			.attr('d', arc)
			.attr('class', 'fillFade');

		if(att.shadow){
			gHarvs.append("path").attr('class', 'harveyShadow').attr("opacity", 0.3);

			gHarvs.select('.harveyShadow')
				.attr('d', arcShadow)
				.attr('class', 'reverseColor');
		}
	}

	if(att.harveyBall){
		att.colors[1] = ['fillFade'];
		data.push({
			data: (att.totalCount - data[0].data)
		});
	}

	if(att.centerBackground){
		bottom.select('.centerBackground')
			.attr('stroke-width', radius * 0.05)
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', radius * att.innerRadius);
	}

	if(att.showCenterPercent){
		bottom.select('.centerPercent')
			.attr("y", "0.25em")
		    .attr("x", 0)
		    .attr('opacity', 1)
			.style('font-size', function(){return (((radius * 0.5 > 170)) ? 170 : (radius * 0.5)) + 'px'; })
			.transition()
			.delay(att.delaySpeed)
			.duration(_transitionSpeed)
			.tween("text", function(d, i) {
	            var i = d3.interpolate(parseInt(this.textContent, 10), Math.round(((data[0].data / att.totalCount) * 100)));
	            var _this = this;
	            return function(t) {
	                _this.textContent = parseFloat(i(t)).toFixed(0) + "%";
	            };
	        });
	}

	var pies = group.selectAll(".arc").data(local.pie(data));

	var gPie = pies.enter()
		.append("g")
	  	.attr("class", "arc");

	pies.exit().remove();

	gPie.append("path")
		.each(function(d) {this._current = (att.clockwise) ? {value: d.data, startAngle:d.startAngle, endAngle:d.startAngle, padAngle:d.padAngle} : {value: d.data, startAngle:d.endAngle, endAngle:d.endAngle, padAngle:d.padAngle};})
		.attr('class', function (d, i) {
		    return "arcBase " + att.colors[(((att.clockwise) ? i : (data.length - 1) - i) % att.colors.length)];
		});

	gPie.merge(pies)
		.select('.arcBase')
		.transition()
		.delay(function(d, i) { if(!att.stagger){return 0;} return (att.clockwise) ? (i * _transitionSpeed) + att.delaySpeed : (((data.length - 1) - i) * _transitionSpeed) + att.delaySpeed; })
		.duration(_transitionSpeed)
		.attrTween("d", arcTween);

	if(att.shadow){
    	gPie.append("path")
			.each(function(d) {this._current = (att.clockwise) ? {value: d.data, startAngle:d.startAngle, endAngle:d.startAngle, padAngle:d.padAngle} : {value: d.data, startAngle:d.endAngle, endAngle:d.endAngle, padAngle:d.padAngle};})
			.attr("opacity", 0.3)
			.attr('class', function (d, i) {
			    return "arcShadow reverseColor";
			});

		pies.select('.arcShadow')
			.transition()
			.delay(function(d, i) { if(!att.stagger){return 0;} return (att.clockwise) ? (i * _transitionSpeed) + att.delaySpeed : (((data.length - 1) - i) * _transitionSpeed) + att.delaySpeed; })
			.duration(_transitionSpeed)
			.attrTween("d", arcTweenShadow);
    }

	if (att.showLabels) {
	    var text = labels.selectAll("text")
	        .data(local.pie(data));

	    var gText = text.enter()
            .append("text");
            
        gText.attr('x', 0)
            .attr('y', '0.3em')
            .attr('opacity', function (d, i) {
                if (d.data.data === 0) {
                    return 0;
                }

                if(att.harveyBall && i > 0){
                	return 0;
                }
            })
            .text(function (d) {
                return parseLabelAlt(d.data, att.labelFormat, att.totalCount, Math.round(((d.data / att.totalCount) * 100)));
            })
            .call(wrap, att.labelMaxWidth);

        gText.merge(text).text(function (d) {
                return parseLabelAlt(d.data, att.labelFormat, att.totalCount, Math.round(((d.data / att.totalCount) * 100)));
            })
            .call(wrap, att.labelMaxWidth);

	    gText.merge(text)
	    	.transition()
	    	.duration(_transitionSpeed)
            .attrTween("transform", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = (radius + att.labelPadding) * (midAngle(d2, att.startAngle) < Math.PI ? (d.data.flip) ? -1 : 1 : (d.data.flip) ? 1 : -1);
                    return "translate(" + pos + ")";
                };
            })
            .styleTween("text-anchor", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    var d2 = interpolate(t);
                    return midAngle(d2, att.startAngle) < Math.PI ? (d.data.flip) ? "end" : "start" : (d.data.flip) ? "start" : "end";
                };
            });

	    text.exit()
            .remove();

	    var polyline = lines.selectAll("polyline")
	        .data(local.pie(data));

        var gPoly = polyline.enter()
                .append("polyline")
                .style('opacity', function (d, i) {
                    if (d.data.data === 0) {
                        return 0;
                    }

                    if(att.harveyBall && i > 0){
                    	return 0;
                    }
                });

    	gPoly.merge(polyline)
    		.transition()
    		.duration(_transitionSpeed)
            .attrTween("points", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = ((radius * 0.95) + att.labelPadding) * (midAngle(d2, att.startAngle) < Math.PI ? (d.data.flip) ? -1 : 1 : (d.data.flip) ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });

	        polyline.exit()
                .remove();
	}
}

Pie.prototype.data = data;
Pie.prototype.att = att;