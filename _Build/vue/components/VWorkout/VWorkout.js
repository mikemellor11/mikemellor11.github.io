"use strict";

export default {
	computed: {
		exercises(){
			return this.$store.state.exercises;
		}
	},

	watch: {
		exercises: {
			deep: true,
			handler(){
				this.$store.commit('exercises', this.exercises);
			}
		}
	},

	components: {
		'VExercise': require('../VExercise/VExercise.vue').default
	}
};