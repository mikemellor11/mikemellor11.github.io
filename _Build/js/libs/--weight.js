(function(exports){
	exports.Weight = function(data){
		if(!data){
			return null;
		}
		
		if (!(this instanceof Weight)) { 
			return new Weight(data);
		}
		this.data = data;
	};

	exports.Weight.prototype = {

		// Fluent methods
		first: function(){
			return this.fromFirst();
		},

		fromFirst: function(index){
			index = (index) ? index : 0;

			if(isNaN(index) || index > (this.data.length - 1) || index < 0){
				return null;
			}

			return exports.Weight([this.data[0 + index]]);
		},

		last: function(){
			return this.fromLast();
		},

		fromLast: function(index){
			index = (index) ? index : 0;

			if(isNaN(index) || index > (this.data.length - 1) || index < 0){
				return null;
			}

			return exports.Weight([this.data[this.data.length - 1 - index]]);
		},

		weight: function(cond){
			return exports.Weight(this.data.filter(function(d, i){
				return cond === d.date;
			}));
		},

		// Utility methods
		cardio: function(reverse){
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

		each: function(cb){
			this.data.forEach(function(d, i){
				cb(d, i);
			});
		},

		length: function(){
			return this.data.length;
		}
	};

})(typeof exports === 'undefined' ? this : exports);