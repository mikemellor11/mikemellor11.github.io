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

	// Fluent methods

	exports.Set.prototype.first = function(){
		return this.fromFirst();
	};

	exports.Set.prototype.fromFirst = function(index){
		index = (index) ? index : 0;

		if(isNaN(index) || index > (this.data.length - 1) || index < 0){
			return null;
		}

		return exports.Set([this.data[0 + index]]);
	};

	exports.Set.prototype.last = function(){
		return this.fromLast();
	};

	exports.Set.prototype.fromLast = function(index){
		index = (index) ? index : 0;

		if(isNaN(index) || index > (this.data.length - 1) || index < 0){
			return null;
		}

		return exports.Set([this.data[this.data.length - 1 - index]]);
	};

	// Utility methods

	exports.Set.prototype.max = function(object){
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
	};

	exports.Set.prototype.volume = function(){
		return this.data.reduce(function(a, b){
			return a + b.weight * b.reps;
		}, 0);
	};

	exports.Set.prototype.weight = function(reverse){
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.weight;
			});
		} else {
			return this.data[0].weight;
		}
	};

	exports.Set.prototype.reps = function(reverse){
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.reps;
			});
		} else {
			return this.data[0].reps;
		}
	};

	exports.Set.prototype.split = function(reverse){
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.split;
			});
		} else {
			return this.data[0].split;
		}
	};

	exports.Set.prototype.length = function(){
		return this.data.length;
	};

})(typeof exports === 'undefined' ? this : exports);