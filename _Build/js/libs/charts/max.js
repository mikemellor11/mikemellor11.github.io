var Workout = require('../workout.js');

export default {
	chart: 'BarStacked',
	data(exercises) {
		return [
			exercises.Chest[2],
			exercises.Legs[0],
			exercises.Back[0],
			exercises.Shoulders[0]
		].map((d) => {
			var last = Workout(d.sessions).last().max();

			return {
				key: d.title,
				values: [
					{
						value: last
					},
					{
						value: Workout(d.sessions).max() - last
					}
				]
			};
		});
	},
	att() {
		return {
			axis: {
				y: {
					rotate: true
				},
				x: {
					flip: false,
					structure: "{value}kg"
				}
			},
			scale: {
				x: 'linear',
				y: 'group'
			},
			plot: {
				x: 'value',
				y: 'key',
				label: 'key'
			},
			autoAxis: 'y',
			min: {
				x: 0
			},
			max: {
				x: 175
			},
			margin: {
				top: 0,
				left: 0,
				bottom: 30,
				right: 20
			},
			stagger: 0,
			primaryIndex: 1,
			aspectRatio: 0.3
		};
	}
};