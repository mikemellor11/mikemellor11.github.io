"use strict";

import * as Utility from "./libs/utility";

import { Line, Text, Key } from "@fishawack/lab-d3";

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';	
dayjs.extend(customParseFormat);

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

			var targets = people.map((d, i) => {
					return {
						key: "Targets",
						values: [{
							key: data[i].values[0].key,
							value: data[i].values[0].value
						}].concat(d.targets)
					};
				});

			var averages = data.map((d) => {
					var arr = d.values.slice(-4);

					return (arr.reduce((a, b) => {
						if(a.last){
							a.total += b.value - a.last.value;
						}

						a.last = b;

						return a;
					}, {last: null, total: 0}).total / arr.length);
				});

			var predictions = people.map((d, i) => {
					var last = data[i].values[data[i].values.length - 1];
					var target = targets[i].values[targets[i].values.length - 1];

					var start = dayjs(target.key, "DD/MM/YYYY");
					var end = dayjs(last.key, "DD/MM/YYYY");
					var weeks = start.diff(end, 'weeks');

					return {
						key: "Predicted",
						values: [
							{
								key: last.key,
								value: last.value
							},
							{
								key: target.key,
								value: last.value + (averages[i] * weeks)
							}
						]
					};
				});

			data = targets.concat(data);
			data = predictions.concat(data);

			chart.data(data)
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