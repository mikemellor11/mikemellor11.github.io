"use strict";

import * as Utility from "./libs/utility";
import dayjs from "dayjs";

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import { Line, Text, Key } from "@fishawack/lab-d3";

import { timeParse } from "d3-time-format";

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	var chart = new Line('.chart--weight')
		.init()
		.att({
			margin: {
				bottom: 0,
				left: 55,
				right: 20
			},
			scale: {
				x: "date"
			},
			plot: {
				label: "key"
			},
			min: {
				y: 60
			},
			max: {
				y: 100
			},
			parseDate: timeParse('%d/%m/%Y'),
			axis: {
				y: {
					tickFormat: "{value}kg",
					tickFormatCustom: true
				}
			},
			value: {
				structure: "{value}kg",
				format: {
					value: ".1f"
				},
				offset: {
					x: 25,
					y: 0
				}
			},
			colors: {
				"Mike": "fill1",
				"Sophie": "fill2",
				"Targets": "fill3"
			}
		})
		.render();

	Utility.load("media/data/weight.json", (mike) => {
		Utility.load("media/data/sophie.json", (sophie) => {
			sophie = JSON.parse(sophie);
			mike = JSON.parse(mike);

			var latest = mike[mike.length - 1];

			new Text('.js-weight')
				.init()
				.att({
					value: {
						format: {
							value: ".1f"
						}
					}
				})
				.data([{value: latest.weight}])
				.render();

			new Text('.js-lastWorkout')
				.init()
				.data([{value: dayjs().diff(dayjs(latest.date, "DD/MM/YYYY"), 'days')}])
				.render();

			mike = mike.filter((d) => {
					return d.date.split("/")[2] === "2019";
				}).map((d) => {
					return {
						key: d.date,
						value: d.weight
					};
				});

			sophie = sophie.filter((d) => {
					return d.date.split("/")[2] === "2019";
				}).map((d) => {
					return {
						key: d.date,
						value: d.weight
					};
				});

			chart.data([
					{
						key: "Targets",
						values: [
							{
								key: "23/02/2019",
								value: mike[0].value
							},
							{
								key: "01/06/2019",
								value: 85
							}
						]
					},
					{
						key: "Mike",
						values: mike
					},
					{
						key: "Targets",
						values: [
							{
								key: "23/02/2019",
								value: sophie[0].value
							},
							{
								key: "01/06/2019",
								value: 63.5
							}
						]
					},
					{
						key: "Sophie",
						values: sophie
					}
				])
				.render();

			new Key('.chart--key')
				.init()
				.att(chart.att())
				.data(chart.data())
				.att({
					key: [
						{
							key: "Mike"
						},
						{
							key: "Sophie"
						},
						{
							key: "Targets"
						}
					]
				})
				.render();
		});
	});

	Utility.load("media/data/arm.json", (response) => {
		var data = JSON.parse(response);

		Utility.load("media/data/back.json", (response) => {
			data = data.concat(JSON.parse(response));

			Utility.load("media/data/chest.json", (response) => {
				data = data.concat(JSON.parse(response));

				Utility.load("media/data/leg.json", (response) => {
					data = data.concat(JSON.parse(response));

					Utility.load("media/data/shoulder.json", (response) => {
						data = data.concat(JSON.parse(response));

						var sets = data.reduce((a, b) => {
							return a.concat(b.sessions.reduce((a, b) => {
								return a.concat(b.sets.map((d) => {
									return d;
								}));
							}, []));
						}, []);

						var hours = sets.reduce((a, b) => {
							var split = b.split.split(':');
							var hours = +split[0];
							var minutes = +split[1] / 60;
							var seconds = +split[2] / 60 / 60;
							var milliseconds = +split[3] / 60 / 60 / 60;

							return a + hours + minutes + seconds + milliseconds;
						}, 0);

						var reps = sets.reduce((a, b) => {
							return a + b.reps;
						}, 0);

						var lifted = sets.reduce((a, b) => {
							return a + b.weight;
						}, 0);

						new Text('.js-timeSpent')
							.init()
							.att({
								value: {
									format: {
										value: ",.0f"
									}
								}
							})
							.data([{value: hours}])
							.render();

						new Text('.js-sets')
							.init()
							.att({
								value: {
									format: {
										value: ",.0f"
									}
								}
							})
							.data([{value: sets.length}])
							.render();

						new Text('.js-reps')
							.init()
							.att({
								value: {
									format: {
										value: ",.0f"
									}
								}
							})
							.data([{value: reps}])
							.render();

						new Text('.js-lifted')
							.init()
							.att({
								value: {
									format: {
										value: ",.0f"
									}
								}
							})
							.data([{value: lifted}])
							.render();
						});
				});
			});
		});
	});

	window.onresize = function() {
		chart.resize()
			.renderSync();
	};

	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();