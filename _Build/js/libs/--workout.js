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

		length: function(){
			return this.data.length;
		}
	};

})(typeof exports === 'undefined' ? this : exports);