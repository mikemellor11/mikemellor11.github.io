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

	exports.Workout.prototype = {

		// Fluent methods
		first: function(){
			return this.fromFirst();
		},

		fromFirst: function(index){
			index = (index) ? index : 0;

			if(isNaN(index) || index > (this.data.length - 1) || index < 0){
				return null;
			}

			return exports.Workout([this.data[0 + index]]);
		},

		last: function(){
			return this.fromLast();
		},

		fromLast: function(index){
			index = (index) ? index : 0;

			if(isNaN(index) || index > (this.data.length - 1) || index < 0){
				return null;
			}

			return exports.Workout([this.data[this.data.length - 1 - index]]);
		},

		workout: function(cond){
			return exports.Workout(this.data.filter(function(d, i){
				return cond === d.date;
			}));
		},

		// Utility methods
		max: function(object){
			return this.sets().max(object);
		},

		volume: function(){
			return this.sets().volume();
		},

		intensity: function(){
			return this.sets().intensity();
		},

		target: function(){
			return this.sets().target();
		},

		date: function(reverse){
			if(this.data.length > 1){
				return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
					return d.date;
				});
			} else {
				return this.data[0].date;
			}
		},

		sets: function(reverse){
			if(this.data.length > 1){
				return exports.Set(((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
					return d.sets;
				}).reduce(function(a, b){
					return a.concat(b);
				}));
			} else {
				return exports.Set(this.data[0].sets);
			}
		},

		each: function(cb){
			this.data.forEach(function(d, i){
				cb(exports.Workout([d]), i);
			});
		},

		length: function(){
			return this.data.length;
		}
	};

})(window);