import { timeParse, timeFormat } from "d3-time-format";

export default {
	margin: {
		bottom: 0,
		left: 55,
		right: 55
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
			tickFormat: "{value}kg",
			tickFormatCustom: true
		},
		x: {
			tickFormat: timeFormat('%b')
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
		"Dad": "fill4",
		"Targets": "fill3",
		"Predicted": "fill5"
	},
	stagger: 0
};