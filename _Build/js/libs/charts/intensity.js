var Gym = require('../gym.js');

export default {
	chart: 'Pie',
	data(exercises) {
		var intensity = {
			Low: 0,
			Medium: 0,
			High: 0
		};

		Gym(exercises.Chest).workouts().each((d) => intensity[d.intensity()]++ );
		Gym(exercises.Legs).workouts().each((d) => intensity[d.intensity()]++ );
		Gym(exercises.Arms).workouts().each((d) => intensity[d.intensity()]++ );
		Gym(exercises.Shoulders).workouts().each((d) => intensity[d.intensity()]++ );
		Gym(exercises.Back).workouts().each((d) => intensity[d.intensity()]++ );

		return [
			{
				value: intensity.Low,
				key: "Low"
			},
			{
				value: intensity.Medium,
				key: "Medium"
			},
			{
				value: intensity.High,
				key: "High"
			}
		]
	},
	att() {
		return {
			plot: {
				label: 'key'
			},
			aspectRatio: 0.625,
			margin: {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			},
			innerRadius: 0.5,
			transitionSpeed: 2000,
			colors: ['fill4', 'fill3', 'fill1']
		};
	}
};