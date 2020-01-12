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
    },

    getters: {
        macros(state){
            var calculate = {};

            for(var macro in state.macros){
                if(state.macros.hasOwnProperty(macro)){
                    calculate[macro] = state.macros[macro];
                    calculate[macro].value = 0;

                    for(var food in state.foods){
                        if(state.foods.hasOwnProperty(food)){
                            calculate[macro].value += (state.foods[food][macro] / 100) * state.foods[food].weight;
                        }
                    }
                }
            }

            return calculate;
        },
        shopping(state){
            return Object.keys(state.foods || {})
                .map(d => {
                    state.foods[d].key = d;
                    return state.foods[d];
                })
                .filter(d => d.weight)
                .sort((a, b) => a.key.localeCompare(b.key));
        }
    }
});