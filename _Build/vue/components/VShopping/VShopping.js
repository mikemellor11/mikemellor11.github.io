"use strict";

export default {
	computed: {
		macros(){
			return this.$store.state.macros;
		},
		shopping(){
			return this.$store.getters.shopping;
		}
	}
};