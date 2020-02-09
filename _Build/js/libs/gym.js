var Workout = require('./workout.js');
var moment = require('moment');

module.exports = function(data){
	if(!data){
		return null;
	}
	
	if (!(this instanceof module.exports)) { 
		return new module.exports(data);
	}

	this.data = data.filter(function(d, i){
			return d.sessions;
		});
};

module.exports.prototype = {

	// Fluent methods
	first() {
		var _this = this;

		return module.exports(
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

	last() {
		var _this = this;

		return module.exports(
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

	workout(cond) {
		var _this = this;

		return module.exports(
			this.data.map(function(d, i){
				return _this.manipulate(d, Workout(d.sessions).workout(cond).data);
			})
			.filter(function(d, i){
				return d.sessions.length;
			})
		);
	},

	select(cond) {
		if(!Array.isArray(cond)){
			return null;
		}

		return module.exports(
			this.data.filter(function(d, i){
				return !(cond.indexOf(d.exercise) === -1);
			})
		);
	},

	// Utility methods
	max(object) {
		return this.workouts().max(object);
	},

	volume() {
		return this.workouts().volume();
	},

	intensity() {
		return this.workouts().intensity();
	},

	target() {
		return this.workouts().target();
	},

	workouts(reverse) {
		if(this.data.length){
			return Workout(
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
			return Workout([]);
		}
	},

	sets(reverse) {
		return this.workouts(reverse).sets();
	},

	filter(start, end) {
		return module.exports(
			this.data.map((d, i) => {
				return this.manipulate(d, Workout(d.sessions).filter(start, end).data);
			})
			.filter((d, i) => {
				return d.sessions.length;
			})
		);
	},

	date(reverse) {
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

	latest() {
		return this.data.reduce(function(a, b){
			var holdDate = moment(b.sessions[b.sessions.length - 1].date, 'DD/MM/YYYY');
			if(!holdDate.isBefore(a)){
				return holdDate;
			} else {
				return a;
			}
		}, null);
	},

	earliest() {
		return this.data.reduce(function(a, b){
			var holdDate = moment(b.sessions[0].date, 'DD/MM/YYYY');

			if(!holdDate.isAfter(a)){
				return holdDate;
			} else {
				return a;
			}
		}, null);
	},

	exercise(reverse) {
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.exercise;
			});
		} else {
			return this.data[0].exercise;
		}
	},

	manipulate(data, sessions) {
		var newObject = {};
		for(var key in data){
			newObject[key] = data[key];
		}
		newObject.sessions = (Array.isArray(sessions)) ? sessions : [sessions];
		return newObject;
	},

	each(cb) {
		this.data.forEach(function(d, i){
			cb(module.exports([d]), i);
		});
	},

	raw() {
		return this.data;
	},

	length() {
		return this.data.length;
	}
};