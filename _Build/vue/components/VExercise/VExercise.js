"use strict";

import moment from "moment";

var Workout = require('../../../js/libs/workout.js');

export default {
	data(){
		return {
			result: {
				reps: '',
				weight: ''
			}
		};
	},

	props: [
		'exercise',
		'area',
		'stopwatch'
	],

	computed: {
		time(){
			return this.stopwatch.time;
		},
		stats(){
			var max = 0;
			var last = 0;
			var target = 0;
			var next = 0;
			var gD = this.exercise.defaults;
			var currentSet = 0;
			var maxLast = 0;
			var weightSplit = 0;
			var weightIncrement = 2.5;
			var readyForIncrease = false;
			var maxSession = 0;
			var volume = 0;
			var today = moment().format('DD/MM/YYYY');
			var consecutiveTargets = 0;

			if(!gD.max){
				gD.max = 'auto';
			}

			if(this.exercise.sessions){
				var workout = Workout(this.exercise.sessions);
				var recentWorkout = workout.last();
				var recentSets = recentWorkout.sets();
				var todayBegan = 0;
				consecutiveTargets = workout.consecutiveTargets();

				if(recentSets.data.length && recentWorkout.date() === today){
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

				readyForIncrease = consecutiveTargets >= gD.incInterval;

				for (var i = 0; i < gD.sets; ++i) {
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

			this.result.reps = gD.reps;
			this.result.weight = target;

			return {
				lastMax: `${maxLast}kg`,
				volume: `${volume}kg`,
				increaseSession: readyForIncrease,

				maxSession: maxSession,

				setsDone: currentSet,
				setsLeft: gD.sets - currentSet,


				last: `${last}kg`,
				target: target,
				weightSplit: `${weightSplit}kg`,
				next: `${next}kg`,
				consecutiveTargets
			};
		}
	},

	methods: {
		defaults(){
			if(window.socket){
				window.socket.emit('changeConfig', {
					"title": this.exercise.title,
					"group": this.area.toLowerCase(),
					"gymDefaults": this.exercise.defaults
				});
			}
		},
		onSubmit(){
			var stats = this.stats;

			if(!this.exercise.sessions || this.exercise.sessions[this.exercise.sessions.length - 1].date !== moment().format('DD/MM/YYYY')){
                if(!this.exercise.sessions){
                    this.exercise.sessions = [];
                }

                this.exercise.sessions.push({
                    date: moment().format('DD/MM/YYYY'),
                    sets: []
                });
            }

            var target = (
					+this.result.weight > stats.target ||
					(
						+this.result.weight >= stats.target &&
						+this.result.reps >= this.exercise.defaults.reps
					)
				);

            this.exercise.sessions[this.exercise.sessions.length - 1].sets.push({
                "weight": this.result.weight,
                "reps": this.result.reps,
                "split":  this.stopwatch.time,
                "target": target
            });

			if(window.socket){
				window.socket.emit('saveLift', {
					"title": this.exercise.title,
					"group": this.area.toLowerCase(),
					"weight": this.result.weight,
					"reps": this.result.reps,
					"split":  this.stopwatch.time,
					"target": target
				});
			}

			this.stopwatch.reset();
		}
	}
};