"use strict";

import Vue from "vue";
import store from "./libs/store";

import * as Utility from "./libs/utility.js";

import * as capitalize from "vue2-filters/src/string/capitalize";

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	window.socket = require("socket.io-client")(`http://${window.location.hostname}:8888`);

	Vue.filter('capitalize', capitalize.default);

	var food = new Vue({el: '#food', store, render: h => h(require('../vue/components/VFood/VFood.vue').default)});
	var shopping = new Vue({el: '#shopping', store, render: h => h(require('../vue/components/VShopping/VShopping.vue').default)});
	var macros = new Vue({el: '#macros', store, render: h => h(require('../vue/components/VMacros/VMacros.vue').default)});

	Utility.load("media/data/food.json").then(d => store.commit('foods', d));
	Utility.load("media/data/macros.json").then(d => store.commit('macros', d));
})();