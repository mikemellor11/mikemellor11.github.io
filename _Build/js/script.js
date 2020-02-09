"use strict";

import "es6-promise/auto";

import Vue from "vue/dist/vue.js";
import store from "./libs/store";

import * as Utility from "./libs/utility";

import * as capitalize from "vue2-filters/src/string/capitalize";

window.d3 = require("d3");

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	window.socket = require("socket.io-client")(`http://${window.location.hostname}:8888`, { reconnection: false });

	Vue.filter('capitalize', capitalize.default);

	var app = new Vue({
		el: '#app',
		store: store,
		components: {
			'vchart': require('../vue/components/VChart/VChart.vue').default,
			'vfood': require('../vue/components/VFood/VFood.vue').default,
			'vshopping': require('../vue/components/VShopping/VShopping.vue').default,
			'vmacros': require('../vue/components/VMacros/VMacros.vue').default,
			'vstopwatch': require('../vue/components/VStopwatch/VStopwatch.vue').default,
			'vexercises': require('../vue/components/VExercises/VExercises.vue').default,
			'vworkout': require('../vue/components/VWorkout/VWorkout.vue').default
		}
	});

	var keys = Object.keys(store.state.exercises);
	Promise.all(keys.map(d => Utility.load(`media/data/${d.toLowerCase()}.json`)))
		.then((areas) => {
			store.commit('exercises', areas.reduce((prev, next, i) => {
				prev[keys[i]] = next;
				return prev;
			}, {}));
		});

	Utility.load("media/data/food.json").then(d => store.commit('foods', d));
	Utility.load("media/data/macros.json").then(d => store.commit('macros', d));
	Utility.load("media/data/weight.json").then((d) => store.commit('weight', d));

	if(window.socket){
		window.socket.on('closeWindow', function (data) {
			window.close();
		});
	}

	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();