var dayjs = require('dayjs');

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

var Gym = require('../gym.js');

export default {
	chart: 'Bar',
	data(exercises) {
		var arr = Gym([].concat(
			exercises.Chest,
			exercises.Shoulders,
			exercises.Arms,
			exercises.Legs,
			exercises.Back
		));

		return [4, 3, 2, 1, 0].map((d) => {
			return {
				value: arr.filter(dayjs().subtract(d + 1, 'months').endOf('month'), dayjs().subtract(d, 'months').endOf('month')).volume(),
				key: dayjs().subtract(d, 'months').endOf('month').format('MMM')
			};
		});
	},
	att() {
		return {
			plot: {
				label: 'key'
			},
			min: {
				y: 0
			},
			colors: ['fill3'],
			margin: {
				left: 62.5
			},
			aspectRatio: 0.75
		};
	}
};