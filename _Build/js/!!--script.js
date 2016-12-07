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