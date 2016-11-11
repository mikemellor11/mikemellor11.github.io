(function(exports){
	exports.Workout = function(data){
		if(!data){
			return null;
		}
		
		if (!(this instanceof Workout)) { 
			return new Workout(data);
		}
		this.data = data;
	};

	// Fluent methods

	exports.Workout.prototype.first = function(){
		return this.fromFirst();
	};

	exports.Workout.prototype.fromFirst = function(index){
		index = (index) ? index : 0;

		if(isNaN(index) || index > (this.data.length - 1) || index < 0){
			return null;
		}

		return exports.Workout([this.data[0 + index]]);
	};

	exports.Workout.prototype.last = function(){
		return this.fromLast();
	};

	exports.Workout.prototype.fromLast = function(index){
		index = (index) ? index : 0;

		if(isNaN(index) || index > (this.data.length - 1) || index < 0){
			return null;
		}

		return exports.Workout([this.data[this.data.length - 1 - index]]);
	};

	// Utility methods

	exports.Workout.prototype.max = function(object){
		if(object){
			var max = null;
			
			this.data.forEach(function(d, i){
				d.sets.forEach(function(dl, il){
					if(!max){
						max = dl;
					}

					if(dl.weight >= max.weight){
						if(dl.weight === max.weight){
							if((dl.weight * dl.reps) > (max.weight * max.reps)){
								max = dl;
							}
						} else {
							max = dl;
						}
					}
				});
			});

			return max;
		}

		return d3.max(this.data, function(d){ 
			return d3.max(d.sets, function(dl){ 
				return dl.weight; 
			});
		});
	};

	exports.Workout.prototype.volume = function(){
		return this.data.reduce(function(a, b){
			return a + b.sets.reduce(function(al, bl){
				return al + bl.weight * bl.reps;
			}, 0);
		}, 0);
	};

	exports.Workout.prototype.date = function(reverse){
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.date;
			});
		} else {
			return this.data[0].date;
		}
	};

	exports.Workout.prototype.sets = function(reverse){
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return exports.Set(d.sets);
			});
		} else {
			return exports.Set(this.data[0].sets);
		}
	};

	exports.Workout.prototype.length = function(){
		return this.data.length;
	};

})(typeof exports === 'undefined' ? this : exports);