import { timeParse } from "d3-time-format";

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
				values: Weight(Targets.weight).filter().values()
			},
			{
				key: "Weight",
				values: Weight(weight).filter().values()
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
				y: 60
			},
			max: {
				y: 110
			},
			parseDate: timeParse('%d/%m/%Y'),
			axis: {
				y: {
					structure: "{value}kg"
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
			symbols: ['Circle'],
		    symbolsSize: 0.05,
		    symbolsRatio: true
		};
	}
};