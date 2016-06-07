(function(){
    "use strict";

    FastClick.attach(document.body);

    document.querySelector('.js-chartSelect').onchange = function(){
    	chartManager.chartIndex = this.selectedIndex;
    	chartManager.update();
    };
})();