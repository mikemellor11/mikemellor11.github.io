(function(exports){
	exports.Gym = function(data){
		if(!data){
			return null;
		}
		
		if (!(this instanceof Gym)) { 
			return new Gym(data);
		}
		this.data = data.filter(function(d, i){
				return d.sessions;
			});
	};

	exports.Gym.prototype = {

		last: function(){
			var _this = this;

			return exports.Gym(
				this.data.map(function(d, i){
					return _this.manipulate(d, d.sessions[d.sessions.length - 1]);
				})
				.filter(function(d, i){
					var holdDate = moment(d.sessions[0].date, 'DD/MM/YYYY');

					if(holdDate.isSame(_this.latest())){
						return true;
					}
				})
			);
		},

		// Utility methods
		max: function(object){
			return this.workouts().max(object);
		},

		volume: function(){
			return this.workouts().volume();
		},

		workouts: function(reverse){
			if(this.data.length > 1){
				return exports.Workout(
					((reverse) 
						? [].concat(this.data).reverse() 
						: this.data
					).map(function(d, i){
						return d.sessions;
					}).reduce(function(a, b){
						return a.concat(b);
					})
				);
			} else {
				return exports.Workout(this.data[0].sessions);
			}
		},

		latest: function(){
			return this.data.reduce(function(a, b){
				var holdDate = moment(b.sessions[b.sessions.length - 1].date, 'DD/MM/YYYY');
				if(!holdDate.isBefore(a)){
					return holdDate;
				} else {
					return a;
				}
			}, null);
		},

		earliest: function(){
			return this.data.reduce(function(a, b){
				var holdDate = moment(b.sessions[0].date, 'DD/MM/YYYY');

				if(!holdDate.isAfter(a)){
					return holdDate;
				} else {
					return a;
				}
			}, null);
		},

		manipulate: function(data, sessions){
			var newObject = {};
			for(var key in data){
				newObject[key] = data[key];
			}
			newObject.sessions = [sessions];
			return newObject;
		},

		length: function(){
			return this.data.length;
		}
	};

})(typeof exports === 'undefined' ? this : exports);