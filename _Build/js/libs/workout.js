var dayjs = require("dayjs");
var customParseFormat = require('dayjs/plugin/customParseFormat');
var isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

var Set = require('./set.js');

module.exports = function(data){
	if(!data){
		return null;
	}
	
	if (!(this instanceof module.exports)) { 
		return new module.exports(data);
	}
	
	this.data = data;
};

module.exports.prototype = {

	// Fluent methods
	first() {
		return this.fromFirst();
	},

	fromFirst(index) {
		index = (index) ? index : 0;

		if(isNaN(index) || index > (this.data.length - 1) || index < 0){
			return null;
		}

		return module.exports([this.data[0 + index]]);
	},

	last() {
		return this.fromLast();
	},

	fromLast(index) {
		index = (index) ? index : 0;

		if(isNaN(index) || index > (this.data.length - 1) || index < 0){
			return null;
		}

		return module.exports([this.data[this.data.length - 1 - index]]);
	},

	workout(cond) {
		return module.exports(this.data.filter(function(d, i){
			return cond === d.date;
		}));
	},

	// Utility methods
	max(object) {
		return this.sets().max(object);
	},

	volume() {
		return this.sets().volume();
	},

	intensity() {
		return this.sets().intensity();
	},

	target() {
		let target = this.data.filter(d => d.target == false).length;

		return !target && this.sets().target();
	},

	// Loop backwards over workouts while the max weight remains the same.
	// If the target was hit and the volume matches then increment count.
	// If the latest workout is in progress then skip over as it shouldn't count towards target calculation
	consecutiveTargets() {
		var index = 0;
		var count = 0;
		var current = this.fromLast(index);

		if(current.date() === dayjs().format('DD/MM/YYYY')){
			current = this.fromLast(++index);
		}

		var max = current.max();
		var volume = current.volume();
		
		while(
			current !== null &&
			current.max() === max &&
			current.target() &&
			current.volume() === volume
		){
			current = this.fromLast(++index);
			count++;
		}

		return count;
	},

	// Filter by date, either string 01/01/2020 or number of days/months from current date. Can pass months/weeks/days string as third parameter to be used in number from calculation
	filter(start, end) {
		return module.exports(this.data.filter((d) => {
			// return true;
			// return dayjs(d.date, "DD/MM/YYYY").isBetween(dayjs(), dayjs().subtract(4, 'months'));
			// return dayjs(d.date, "DD/MM/YYYY").isSame(dayjs(), 'year');
			return dayjs(d.date, "DD/MM/YYYY").isBetween(start, end);
		}));
	},

	date(reverse) {
		if(this.data.length > 1){
			return (reverse ? this.data.slice().reverse() : this.data).map(function(d, i){
				return d.date;
			});
		} else {
			return this.data[0].date;
		}
	},

	sets(reverse) {
		if(this.data.length){
			return Set((reverse ? this.data.slice().reverse() : this.data).map(function(d, i){
				return d.sets;
			}).reduce(function(a, b){
				return a.concat(b);
			}));
		} else {
			return Set([]);
		}
	},

	each(cb) {
		this.data.forEach(function(d, i){
			cb(module.exports([d]), i);
		});
	},

	length() {
		return this.data.length;
	}
};