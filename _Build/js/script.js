"use strict";

import * as Utility from "./libs/utility";
import { Line, Text, Key } from "@fishawack/lab-d3";

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	var chart = new Line('.chart--weight')
		.att(require('./libs/atts.js').default)
		.init()
		.render();

	var people = require('./libs/people.js').default;

	Promise.all(people.map((d) => 
			Utility.load("media/data/" + (d.file || d.name.toLocaleLowerCase()) + ".json")
		))
		.then((results) => {
			var data = results.map((d, i) => {
					return {
						key: people[i].name,
						values: d.filter((d) => {
								return d.date.split("/")[2] === "2019";
							}).map((d) => {
								return {
									key: d.date,
									value: d.weight
								};
							})
					};
				});

			chart.data(people.map((d, i) => {
					return {
						key: "Targets",
						values: [{
							key: data[i].values[0].key,
							value: data[i].values[0].value
						}].concat(d.targets)
					};
				}).concat(data))
				.render();

			new Key('.chart--key')
				.init()
				.att(chart.att())
				.data(chart.data())
				.render();
		});

	window.onresize = function() {
		chart.resize()
			.renderSync();
	};

	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();