"use strict";

export default {
	computed: {
		exercises(){
			return this.$store.state.exercises;
		},
		stopwatch(){
			return this.$root.$refs.stopwatch;
		}
	},

	watch: {
		exercises: {
			deep: true,
			handler(){
				if(!Object.keys(this.exercises).reduce((a, b) => {
					return a + this.exercises[b].filter(d => d.active).length;
				}, 0)){
					this.stopwatch.reset();
					this.stopwatch.stop();
				}

				this.$store.commit('exercises', this.exercises);
			}
		}
	}
};