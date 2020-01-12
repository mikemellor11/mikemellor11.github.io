"use strict";

export default {
	computed: {
		shopping(){
			return this.$store.getters.shopping;
		}
	}
};