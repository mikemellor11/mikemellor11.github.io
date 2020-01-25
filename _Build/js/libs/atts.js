import { timeParse, timeFormat } from "d3-time-format";

export default {
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
	colors: {
		"Mike": "fill1",
		"Sophie": "fill2",
		"Dad": "fill4",
		"Mum": "fill5",
		"Targets": "fill3"
	},
	stagger: 0
};