import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
    	foods: null,
        macros: null
    },

    mutations: {
    	foods(state, value){
    		state.foods = value;
    	},
        macros(state, value){
            state.macros = value;
        }
    }
});