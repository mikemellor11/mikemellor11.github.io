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
		return this.sets().target();
	},

	date(reverse) {
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.date;
			});
		} else {
			return this.data[0].date;
		}
	},

	sets(reverse) {
		if(this.data.length > 1){
			return Set(((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.sets;
			}).reduce(function(a, b){
				return a.concat(b);
			}));
		} else {
			return Set(this.data[0].sets);
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