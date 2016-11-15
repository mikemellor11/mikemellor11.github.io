(function(exports){
	exports.Set = function(data){
		if(!data){
			return null;
		}
		
		if (!(this instanceof Set)) { 
			return new Set(data);
		}
		this.data = data;
	};

	exports.Set.prototype = {

		// Fluent methods
		first: function(){
			return this.fromFirst();
		},

		fromFirst: function(index){
			index = (index) ? index : 0;

			if(isNaN(index) || index > (this.data.length - 1) || index < 0){
				return null;
			}

			return exports.Set([this.data[0 + index]]);
		},

		last: function(){
			return this.fromLast();
		},

		fromLast: function(index){
			index = (index) ? index : 0;

			if(isNaN(index) || index > (this.data.length - 1) || index < 0){
				return null;
			}

			return exports.Set([this.data[this.data.length - 1 - index]]);
		},

		// Utility methods
		max: function(object){
			if(object){
				var max = null;
				
				this.data.forEach(function(d, i){
					if(!max){
						max = d;
					}

					if(d.weight >= max.weight){
						if(d.weight === max.weight){
							if((d.weight * d.reps) > (max.weight * max.reps)){
								max = d;
							}
						} else {
							max = d;
						}
					}
				});

				return max;
			}

			return d3.max(this.data, function(d){
				return d.weight;
			});
		},

		volume: function(){
			return this.data.reduce(function(a, b){
				return a + b.weight * b.reps;
			}, 0);
		},

		weight: function(reverse){
			if(this.data.length > 1){
				return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
					return d.weight;
				});
			} else {
				return this.data[0].weight;
			}
		},

		reps: function(reverse){
			if(this.data.length > 1){
				return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
					return d.reps;
				});
			} else {
				return this.data[0].reps;
			}
		},

		split: function(reverse){
			if(this.data.length > 1){
				return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
					return d.split;
				});
			} else {
				return this.data[0].split;
			}
		},

		length: function(){
			return this.data.length;
		}
	};

})(typeof exports === 'undefined' ? this : exports);