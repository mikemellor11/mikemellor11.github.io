"use strict";

export default {
	data(){
		return {
			search: '',
			filter: {
				high: '',
				low: ''
			}
		};
	},

	computed: {
		filtered(){
			var filtered = {};

			for(var key in this.foods){
				if(this.foods.hasOwnProperty(key)){
					if(!this.search || key.includes(this.search)){
						if(this.filter.high && this.percent(this.filter.high, this.foods[key][this.filter.high]) < 10){
							continue;
						}

						if(this.filter.low && this.percent(this.filter.low, this.foods[key][this.filter.low]) > 2.5){
							continue;
						}

						filtered[key] = this.foods[key];
					}
				}
			}

			return filtered;
		},
		sorted(){
			var sorted = {};

			Object.keys(this.filtered).sort().forEach(d => sorted[d] = this.filtered[d]);

			return sorted;
		},
		foods() {
			return this.$store.state.foods;
	    },
	    macros(){
			return this.$store.getters.macros;
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
		percent(key, value){
			return ((value / this.macros[key].GDA) * 100).toFixed(1);
		},
		submit(){
			if(window.socket){
				window.socket.emit('saveFood', this.foods);
			}
		},
		reset(){
			for(var food in this.foods) {
				if(this.foods.hasOwnProperty(food)){
					this.foods[food].weight = this.foods[food].min || 0;
				}
			}
		},
		random(){
			var found = true;

			for(var key in this.macros) {
				if(this.macros.hasOwnProperty(key)){
					var macro = this.macros[key];

					if(macro.value > (macro.target + macro.margin.upper)){
						for(var food in this.foods) {
							if(this.foods.hasOwnProperty(food)){
								this.foods[food].weight = this.foods[food].min || 0;
							}
						}
						
						this.$nextTick(() => {
							this.random();
						});

						return;
					} else if(macro.value < (macro.target - macro.margin.lower)){
						found = false;
					}
				}
			}

			if(!found){
				var random = 0;
				var randomFood = '';
				var randomFoodJson = '';
				var hold;
				var value;
				var suitable = true;
				var maxAdd = 0;

				var foodJson = this.foods;
				var foodJsonArr = Object.keys(foodJson).map(function(k) { return k; });

				do{
					suitable = true;
					random = Math.floor(Math.random()*((foodJsonArr.length - 1)-0+1)+0);
					randomFood = foodJsonArr[random];
					randomFoodJson = foodJson[randomFood];

					if(randomFoodJson.notIf){
						for(var i = 0; i < randomFoodJson.notIf.length; i++){
							if(foodJson[randomFoodJson.notIf[i]].weight > 0){
								suitable = false;
								break;
							}
						}
					}

					if(randomFoodJson.onlyIf){
						for(i = 0; i < randomFoodJson.onlyIf.length; i++){
							if(foodJson[randomFoodJson.onlyIf[i]].weight <= 0){
								suitable = false;
								break;
							}
						}
					}

					if(suitable){
						value = this.foods[randomFood].weight;
					}
				} while (
						!suitable ||
						value >= randomFoodJson.max
					);

				maxAdd = (randomFoodJson.max - value) * 0.5;

				value += Math.floor(Math.random()*(maxAdd-0+1)+0);

				value = randomFoodJson.multiple * Math.round(value / randomFoodJson.multiple);

				this.foods[randomFood].weight = value;

				setTimeout(() => {
					this.random();
				});
			}
		}
	}
};