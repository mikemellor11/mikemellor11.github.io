"use strict";

import * as Utility from "./libs/utility";
import dayjs from "dayjs";

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	Utility.load("media/data/weight.json", (response) => {
		var data = JSON.parse(response);
		var latest = data[data.length - 1];

		Utility.eachNode('.js-weight', (node) => {
			node.textContent = latest.weight;
		});

		Utility.eachNode('.js-lastWorkout', (node) => {
			node.textContent = dayjs().diff(dayjs(latest.date, "DD/MM/YYYY"), 'days');
		});
	});


	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();