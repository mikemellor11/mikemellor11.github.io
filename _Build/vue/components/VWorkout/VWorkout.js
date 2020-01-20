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

	methods: {
		defaults(exercise, area){
			if(window.socket){
				window.socket.emit('changeConfig', {
					"title": exercise.title,
					"group": area.toLowerCase(),
					"gymDefaults": exercise.defaults
				});
			}
		}
	}
};