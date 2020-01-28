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

	// Utility methods
	max(object) {
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

		return Math.max.apply(Math, this.data.map(d => d.weight));
	},

	volume() {
		return this.data.reduce(function(a, b){
			return a + b.weight * b.reps;
		}, 0);
	},

	intensity() {
		var split = this.split();
		
		if(Array.isArray(split)){
			split = average(
					split.filter(function(d, i){
						if(d === '00:00:00:000'){
							return false;
						}
						return true;
					}).map(function(d, i){
						return formatTime(d);
					})
				)
		} else {
			split = formatTime(split);
		}

		if(split < 120000){
			return 'High'
		} else if(split < 180000){
			return 'Medium'
		}
		return 'Low';
	},

	target() {
		if(this.data.length > 1){
			return this.data.map(function(d, i){
				return d.target;
			})
			.indexOf(false) === -1;
		} else {
			return this.data[0].target;
		}
	},

	weight(reverse) {
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.weight;
			});
		} else {
			return this.data[0].weight;
		}
	},

	reps(reverse) {
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.reps;
			});
		} else {
			return this.data[0].reps;
		}
	},

	split(reverse) {
		if(this.data.length > 1){
			return ((reverse) ? [].concat(this.data).reverse() : this.data).map(function(d, i){
				return d.split;
			});
		} else {
			return this.data[0].split;
		}
	},

	each(cb) {
		this.data.forEach(function(d, i){
			cb(d, i);
		});
	},

	map(cb) {
		return this.data.map(function(d, i){
			return cb(d, i);
		});
	},

	length() {
		return this.data.length;
	}
};

function average(array){
	var sum = 0;

	for( var i = 0; i < array.length; i++ ){
		sum += parseInt(array[i], 10);
	}

	return sum / array.length;
}

function formatTime(time) {
	var split = time.split(':');
	var h = split[0];
	var m = split[1];
	var s = split[2];
	var ms = split[3];

	h = +h * (60 * 60 * 1000);
	m = +m * (60 * 1000);
	s = +s * 1000;

	return h + m + s + +ms;
}