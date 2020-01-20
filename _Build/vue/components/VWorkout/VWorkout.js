"use strict";

import moment from "moment";

export default {
	computed: {
		exercises(){
			return this.$store.state.exercises;
		}
	},

	watch: {
		exercises: {
			deep: true,
			handler(){
				this.$store.commit('exercises', this.exercises);
			}
		}
	},

	methods: {
		defaults(exercise, area){
			if(window.socket){
				window.socket.emit('changeConfig', {
					"title": exercise.title,
					"group": area.toLowerCase(),
					"gymDefaults": exercise.defaults
				});
			}
		},
		stats(exercise){
			var max = 0;
			var last = 0;
			var target = 0;
			var next = 0;
			var gD = exercise.defaults;
			var currentSet = 0;
			var maxLast = 0;
			var weightSplit = 0;
			var weightIncrement = 2.5;
			var readyForIncrease = false;
			var maxSession = 0;
			var volume = 0;
			var today = moment().format('DD/MM/YYYY');

			if(!gD.max){
				gD.max = 'auto';
			}

			if(exercise.sessions){
				var workout = window.Workout(exercise.sessions);
				var recentWorkout = workout.last();
				var recentSets = recentWorkout.sets();
				var todayBegan = 0;

				if(recentWorkout.date() === today){
					todayBegan = 1;
				}

				max = workout.max();

				if(todayBegan){
					currentSet = recentSets.length();
					volume = recentWorkout.volume();
					last = recentSets.last().weight();
					maxLast = workout.fromLast(1).max();
				} else {
					maxLast = recentWorkout.max();
				}

				if(gD.max !== 'auto'){
					maxLast = gD.max;
				}

				// Intervals set and theres enough sessions to calculate
				if(gD.incInterval > 0 && workout.length() > (gD.incInterval + todayBegan)){
					readyForIncrease = true;

					var holdLastMax = 0;
					var holdVolumeLast = 0;

					for(var i = 0; i < gD.incInterval; i++){
						var index = i + todayBegan;
						var lastWorkout = workout.fromLast(index);
						var tempLastMax = lastWorkout.max();
						var tempVolumeLast = lastWorkout.volume();

						if(tempVolumeLast > holdVolumeLast){
							holdVolumeLast = tempVolumeLast;
						}
						if(tempLastMax > holdLastMax){
							holdLastMax = tempLastMax;
						}
					}

					for(i = 0; i < gD.incInterval; i++){
						index = i + todayBegan;
						lastWorkout = workout.fromLast(index);
						tempLastMax = lastWorkout.max();
						tempVolumeLast = lastWorkout.volume();

						if(tempLastMax < holdLastMax || tempVolumeLast < holdVolumeLast || !lastWorkout.target()){
							readyForIncrease = false;
							break;
						}
					}
				}

				for (i = 0; i < gD.sets; ++i) {
					var base = 0;
					var incrememnt = 0;
					var currentWeight = 0;

					if(i < gD.peak){
						if(gD.peak <= 1){
							currentWeight = maxLast;
						} else {
							base = gD.startPercent * maxLast;
							incrememnt = maxLast - base;
							incrememnt /= (gD.peak - 1);
							currentWeight = base + (incrememnt * i);
						}
					} else {
						base = gD.endPercent * maxLast;
						incrememnt = maxLast - base;
						incrememnt /= (gD.sets - gD.peak);
						currentWeight = maxLast - (incrememnt * (i - (gD.peak - 1)));
					}

					if(readyForIncrease){
						currentWeight += gD.increase;
					}

					if(currentWeight > maxSession){
						maxSession = currentWeight;
					}

					if(i === currentSet){
						target = weightIncrement * Math.round(currentWeight / weightIncrement);
					} else if(i === currentSet + 1){
						next = weightIncrement * Math.round(currentWeight / weightIncrement);
					}
				}

				weightSplit = ((target - gD.equipmentWeight) * 0.5);
				if(weightSplit <= 0){
					weightSplit = 0;
				}
			}

			return {
				lastMax: `${maxLast}kg`,
				volume: `${volume}kg`,
				increaseSession: readyForIncrease,

				maxSession: maxSession,

				setsDone: currentSet,
				setsLeft: gD.sets - currentSet,


				last: `${last}kg`,
				target: `${target}kg`,
				weightSplit: `${weightSplit}kg`,
				next: `${next}kg`
			};
		}
	}
};