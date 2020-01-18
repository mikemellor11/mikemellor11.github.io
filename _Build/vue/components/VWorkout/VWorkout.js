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
		defaults(e){
			if(window.socket){
				console.log("ASDF", e.target);
				/*window.socket.emit('changeConfig', {
					"exercise": $(this).data('exercise'),
					"group": $(this).data('group'),
					"gymDefaults": {
						"sets": $('.js-sets', this).val(),
			            "reps": $('.js-reps', this).val(),
			            "peak": $('.js-peak', this).val(),
			            "increase": $('.js-increase', this).val(),
			            "startPercent": (+$('.js-startPercent', this).val() / 100),
			            "endPercent": (+$('.js-endPercent', this).val() / 100),
			            "incInterval": $('.js-incInterval', this).val(),
			            "equipmentWeight": $('.js-equipmentWeight', this).val(),
			            "max": $('.js-max', this).val()
					}
				});*/
			}
		}
	}
};