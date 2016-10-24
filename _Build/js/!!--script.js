(function(){
    "use strict";

    FastClick.attach(document.body);

    baseJS();

    pageJS();
})();


// jshint freeze:false
if (!Array.prototype.last){
    Array.prototype.last = function(){
    	"use strict";

        return this[this.length - 1];
    };
}

if (!Array.prototype.fromEnd){
    Array.prototype.fromEnd = function(num){
    	"use strict";

        return this[this.length - (num + 1)];
    };
}