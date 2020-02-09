"use strict";

import { Bar, Line, Pie, BarStacked, Table, Key } from "@fishawack/lab-d3";

var charts = {
	Bar,
	Line,
	Pie,
	BarStacked,
	Table,
	Key
};

import max from "../../../js/libs/charts/max.js";
import intensity from "../../../js/libs/charts/intensity.js";
import weight from "../../../js/libs/charts/weight.js";
import volume from "../../../js/libs/charts/volume.js";
import workout from "../../../js/libs/charts/workout.js";

var types = {
	max,
	intensity,
	weight,
	volume,
	workout
};

export default {
	data(){
		return {
			chart: null,
			key: null
		};
	},

	props: ['type'],

	computed: {
		self(){
			return types[this.type];
		},
		exercises(){
			return this.$store.state.exercises;
		},
		weight(){
			return this.$store.state.weight;
		}
	},

	watch: {
		exercises: {
			deep: true,
			handler(){ this.update(); }
		},
		weight: {
			deep: true,
			handler(){ this.update(); }
		}
	},

	methods: {
		update(){
			if(!this.exercises.Chest || !this.weight){
				return;
			}

			this.chart.data(this.self.data(this.exercises, this.weight))
				.render();

			this.key.data(this.self.data(this.exercises, this.weight))
				.render();
		},
		resize(){
			this.chart.resize()
				.renderSync();
		}
	},

	mounted(){
		this.chart = new charts[this.self.chart](this.$refs.chart)
			.att(this.self.att())
			.init();

		this.key = new Key(this.$refs.key)
			.att(this.chart.att())
			.init();

		this.update();

		window.addEventListener('resize', this.resize);
	},

	beforeDestroy: function () {
		window.removeEventListener('resize', this.resize);
	}
};