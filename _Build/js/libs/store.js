import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
    	foods: null,
        macros: null,
        defaults: {
            "sets": 9,
            "reps": 8,
            "peak": 5,
            "increase": 5,
            "startPercent": 0.75,
            "endPercent": 0.8,
            "incInterval": 3,
            "equipmentWeight": 20,
            "max": "auto"
        }
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