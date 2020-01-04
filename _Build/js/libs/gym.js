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

		// Fluent methods
		first: function(){
			var _this = this;

			return exports.Gym(
				this.data.map(function(d, i){
					return _this.manipulate(d, d.sessions[0]);
				})
				.filter(function(d, i){
					var holdDate = moment(d.sessions[0].date, 'DD/MM/YYYY');

					if(holdDate.isSame(_this.earliest())){
						return true;
					}
				})
			);
		},

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

		workout: function(cond){
			var _this = this;

			return exports.Gym(
				this.data.map(function(d, i){
					return _this.manipulate(d, exports.Workout(d.sessions).workout(cond).data);
				})
				.filter(function(d, i){
					return d.sessions.length;
				})
			);
		},

		select: function(cond){
			if(!Array.isArray(cond)){
				return null;
			}

			return exports.Gym(
				this.data.filter(function(d, i){
					return !(cond.indexOf(d.exercise) === -1);
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

		intensity: function(){
			return this.workouts().intensity();
		},

		target: function(){
			return this.workouts().target();
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

		sets: function(reverse){
			return this.workouts(reverse).sets();
		},

		date: function(reverse){
			return this.workouts().date().filter(function(item, i, ar){ 
					return ar.indexOf(item) === i; 
				}).sort(function (left, right) {
					if(reverse){
						return moment(right, 'DD/MM/YYYY').diff(moment(left, 'DD/MM/YYYY'));
					} else {
						return moment(left, 'DD/MM/YYYY').diff(moment(right, 'DD/MM/YYYY'));
					}
				});
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

		exercise: function(reverse){
			if(this.data.length > 1){
				return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
					return d.exercise;
				});
			} else {
				return this.data[0].exercise;
			}
		},

		manipulate: function(data, sessions){
			var newObject = {};
			for(var key in data){
				newObject[key] = data[key];
			}
			newObject.sessions = (Array.isArray(sessions)) ? sessions : [sessions];
			return newObject;
		},

		each: function(cb){
			this.data.forEach(function(d, i){
				cb(exports.Gym([d]), i);
			});
		},

		raw: function(){
			return this.data;
		},

		length: function(){
			return this.data.length;
		}
	};

})(window);