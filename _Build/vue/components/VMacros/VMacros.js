"use strict";

export default {
	computed: {
		macros(){
			return this.$store.getters.macros;
		},
		foods(){
			return this.$store.state.foods;
		}
	}
};