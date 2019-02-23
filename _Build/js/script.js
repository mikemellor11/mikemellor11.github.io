"use strict";

import * as Utility from "./libs/utility";
import dayjs from "dayjs";

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import { Line } from "@fishawack/lab-d3";

import { timeParse } from "d3-time-format";

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	var chart = new Line('.chart--weight')
		.init()
		.att({
			margin: {
				bottom: 40,
				left: 40
			},
			scale: {
				x: "date"
			},
			parseDate: timeParse('%d/%m/%Y'),
		})
		.render();

	Utility.load("media/data/weight.json", (response) => {
		var data = JSON.parse(response);
		var latest = data[data.length - 1];

		Utility.eachNode('.js-weight', (node) => {
			node.textContent = latest.weight;
		});

		Utility.eachNode('.js-lastWorkout', (node) => {
			node.textContent = dayjs().diff(dayjs(latest.date, "DD/MM/YYYY"), 'days');
		});

		chart.data([
				{
					values: data.map(function(d){
						return {
							key: d.date,
							value: d.weight
						};
					})
				}
			])
			.render();
	});

	window.onresize = function() {
		chart.resize()
			.renderSync();
	};

	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();