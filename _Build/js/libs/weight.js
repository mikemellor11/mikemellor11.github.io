var dayjs = require("dayjs");
var customParseFormat = require('dayjs/plugin/customParseFormat');
var isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

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

	/*
	How weight is trending either up or down over the last 4 workouts
	*/
	trend(){
		var arr = this.data.slice(-4);

		return (arr.reduce((a, b) => {
			if(a.last){
				a.total += b.weight - a.last.weight;
			}

			a.last = b;

			return a;
		}, {last: null, total: 0}).total / arr.length);
	},

	/*
	What the predicted weight will be based on trend
	*/
	predicted(){
		var last = this.last().data[0];
		var date = dayjs(last.date, "DD/MM/YYYY").add(4, 'weeks');

		return module.exports([{
			date: date.format('DD/MM/YYYY'),
			weight: last.weight + (this.trend() * 4)
		}]);
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

	filter() {
		return module.exports(this.data.filter((d) => {
			// return true;
			// return dayjs(d.date, "DD/MM/YYYY").isBetween(dayjs(), dayjs().subtract(4, 'months'));
			// return dayjs(d.date, "DD/MM/YYYY").isSame(dayjs(), 'year');
			return dayjs(d.date, "DD/MM/YYYY").isBetween(dayjs().subtract(2, 'months'), dayjs().add(4, 'months'));
		}));
	},

	values() {
		return this.data.map((d) => {
			return {
				key: d.date,
				value: d.weight
			};
		});
	},

	each(cb) {
		this.data.forEach((d, i) => cb(d, i));
	},

	length() {
		return this.data.length;
	}
};