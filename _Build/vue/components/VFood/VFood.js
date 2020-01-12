"use strict";

import * as Utility from "../../../js/libs/utility.js";

export default {
	data(){
		return {
			food: null
		};
	},

	methods: {
		submit(){
			if(window.socket){
				window.socket.emit('saveFood', this.food);
			}
		}
	},

	mounted(){
		Utility.load("media/data/food.json").then(d => this.food = d);
	}
};