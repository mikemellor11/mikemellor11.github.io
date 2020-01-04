"use strict";

import "es6-promise/auto";

import * as Utility from "./libs/utility";

import { Line, Text, Key } from "@fishawack/lab-d3";

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';	
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

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
								// return dayjs(d.date, "DD/MM/YYYY").isBetween(dayjs(), dayjs().subtract(4, 'months'));
								return dayjs(d.date, "DD/MM/YYYY").isSame(dayjs(), 'year');
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
						values: d.targets
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
						key: d.name,
						values: [
							{
								key: last.key,
								value: last.value,
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
})();