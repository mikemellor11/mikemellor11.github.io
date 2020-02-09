import { timeParse, timeFormat } from "d3-time-format";

var dayjs = require("dayjs");

var Weight = require('../weight.js');

import Targets from "../targets.js";

export default {
	chart: 'Line',
	data(exercises, weight) {
		return [
			{
				key: "Predicted",
				values: [].concat(
						Weight(weight).last().values(),
						Weight(weight).predicted().values()
					)
			},
			{
				key: "Target",
				values: Weight(Targets.weight).values()
			},
			{
				key: "Weight",
				values: Weight(weight).values()
			}
		];
	},
	att() {
		return {
			margin: {
				bottom: 0,
				left: 60,
				right: 25
			},
			padding: {
				space: 15
			},
			scale: {
				x: "date"
			},
			plot: {
				label: "key"
			},
			min: {
				x: dayjs().subtract(4, 'months').format('DD/MM/YYYY'),
				y: 70
			},
			max: {
				y: 100
			},
			parseDate: timeParse('%d/%m/%Y'),
			axis: {
				y: {
					structure: "{value}kg"
				},
				x: {
					structure: timeFormat("%y-%m-%d"),
					ticks: 5
				}
			},
			symbols: ['Circle'],
		    symbolsSize: 0.05,
		    symbolsRatio: true,
		    aspectRatio: 0.75
		};
	}
};