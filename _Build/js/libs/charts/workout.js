var Gym = require('../gym.js');
var Workout = require('../workout.js');

export default {
	chart: 'Table',
	data(exercises) {
		return [
			{
				values: [
					{
						value: "Exercise"
					},
					{
						value: "Sets"
					},
					{
						value: "Target"
					},
					{
						value: "Volume"
					},
					{
						value: "Max"
					},
					{
						value: "Intensity"
					}
				]
			}
		].concat(
			Gym([].concat(
				exercises.Chest,
				exercises.Shoulders,
				exercises.Arms,
				exercises.Legs,
				exercises.Back
			)).last().data.map((d, i) => {
				return {
					values: [
						{
							value: d.title
						},
						{
							value: Workout(d.sessions).sets().length()
						},
						{
							value: Workout(d.sessions).target(),
							classes: ['highlight', (Workout(d.sessions).target()) ? 'good' : 'bad']
						},
						{
							value: Workout(d.sessions).volume()
						},
						{
							value: Workout(d.sessions).max()
						},
						{
							value: Workout(d.sessions).intensity()
						}
					]
				};
			})
		);
	},
	att() {
		return {
		};
	}
};