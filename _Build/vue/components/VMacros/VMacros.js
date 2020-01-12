"use strict";

export default {
	computed: {
		macros(){
			var calculate = {};

			for(var macro in this.$store.state.macros){
				if(this.$store.state.macros.hasOwnProperty(macro)){
					calculate[macro] = this.$store.state.macros[macro];
					calculate[macro].value = 0;

					for(var food in this.foods){
						if(this.foods.hasOwnProperty(food)){
							calculate[macro].value += (this.foods[food][macro] / 100) * this.foods[food].weight;
						}
					}
				}
			}

			return calculate;
		},
		foods(){
			return this.$store.state.foods;
		}
	}
};