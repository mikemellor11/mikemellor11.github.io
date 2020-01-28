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

	weight(cond) {
		return module.exports(this.data.filter(function(d, i){
			return cond === d.date;
		}));
	},

	// Utility methods
	cardio(reverse) {
		if(this.data.length){
			if(this.data.length > 1){
				return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
					return (d.cardio) ? d.cardio : 0;
				});
			} else {
				return this.data[0].cardio ? this.data[0].cardio : 0;
			}
		}

		return null;
	},

	each(cb) {
		this.data.forEach(function(d, i){
			cb(d, i);
		});
	},

	length() {
		return this.data.length;
	}
};