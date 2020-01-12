"use strict";

export default {
	data(){
		return {
			areas: {
				Chest: null,
	            Back: null,
	            Shoulders: null,
	            Legs: null,
	            Arms: null
			}
		};
	},

	mounted(){
		var keys = Object.keys(this.areas);
		
		Promise.all(keys.map(d => window.Utility.load(`media/data/${d.toLowerCase()}.json`)))
			.then((areas) => {
				areas.forEach((d, i) => {
					this.areas[keys[i]] = d;
				});
			});
	}
};