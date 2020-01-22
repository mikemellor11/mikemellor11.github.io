"use strict";

import Vue from "vue";
import store from "./libs/store";

import * as Utility from "./libs/utility.js";

window.Utility = Utility;
window.d3 = require("d3");

import "./libs/set.js";
import "./libs/workout.js";
import "./libs/gym.js";

window.moment = require('moment');

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	window.socket = require("socket.io-client")(`http://${window.location.hostname}:8888`, { reconnection: false });

	var stopwatch = new Vue({el: '#stopwatch', store, render: h => h(require('../vue/components/VStopwatch/VStopwatch.vue').default)});
	var exercises = new Vue({el: '#exercises', store, render: h => h(require('../vue/components/VExercises/VExercises.vue').default), data: { stopwatch }});
	var workout = new Vue({el: '#workout', store, render: h => h(require('../vue/components/VWorkout/VWorkout.vue').default), data: { stopwatch }});

	var keys = Object.keys(store.state.exercises);
		
	Promise.all(keys.map(d => window.Utility.load(`media/data/${d.toLowerCase()}.json`)))
		.then((areas) => {
			store.commit('exercises', areas.reduce((prev, next, i) => {
				prev[keys[i]] = next;
				return prev;
			}, {}));
		});
})();