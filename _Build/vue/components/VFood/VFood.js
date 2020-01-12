"use strict";

export default {
	computed: {
		foods() {
			return this.$store.state.foods;
	    }
	},

	watch: {
		foods: {
			deep: true,
			handler(){
				this.$store.commit('foods', this.foods);
			}
		}
	},

	methods: {
		submit(){
			if(window.socket){
				window.socket.emit('saveFood', this.foods);
			}
		}
	}
};