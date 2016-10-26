var h = document.querySelectorAll('.header');

(function(){
    "use strict";

    FastClick.attach(document.body);

    baseJS();

    pageJS();
})();

window.onscroll = function(e) {
    "use strict";

    var offset = window.pageYOffset;

    if(offset > 0){
        h[0].classList.add('stuck');
        h[1].classList.add('stuck');
    } else {
        h[0].classList.remove('stuck');
        h[1].classList.remove('stuck');
    }
};

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