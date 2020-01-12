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

import "./libs/gym-live.js";

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	window.socket = require("socket.io-client")(`http://${window.location.hostname}:8888`);

	var exercises = new Vue({el: '#exercises', store, render: h => h(require('../vue/components/VExercises/VExercises.vue').default)});
})();