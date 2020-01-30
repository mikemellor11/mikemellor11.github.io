"use strict";

import "es6-promise/auto";

import * as Utility from "./libs/utility";

import { Line, Text, Key } from "@fishawack/lab-d3";

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';	
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

var Weight = require('./libs/weight.js');

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
			chart.data([].concat(
					people.map((d, i) => ({
							key: d.name,
							values: Weight(results[i]).filter().values()
						})),
					people.map((d, i) => ({
							key: d.name,
							values: [].concat(
									Weight(results[i]).last().values(),
									Weight(results[i]).predicted().values()
								)
						})),
					people.map((d, i) => ({
							key: "Targets",
							values: Weight(d.targets).filter().values()
						}))
				))
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