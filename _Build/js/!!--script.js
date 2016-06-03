(function(){
    "use strict";

    FastClick.attach(document.body);

    var chestChart = createLine('#chart0');

    d3.json('media/chest.json', function (err, JSON) {
        if(!err){
            chestChart.width(d3.select('.delta').node().getBoundingClientRect().width).attr(JSON.attributes).data(JSON.data).call(chestChart);
        }
    });
})();