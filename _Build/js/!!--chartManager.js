var chartManager = (function() {
    "use strict";

    var chartHolder = null;

    return {
        charts: null,
        chartIndex: 0,
        init: function(){
            chartHolder = createLine('.chart')
                .width(document.querySelector('.delta').offsetWidth)
                .attr({
                    colors: ['fill1', 'fill2', 'fill3'],
                    yLabel: "Weight (kg)",
                    margin: {
                        right: 40,
                        bottom: 40
                    },
                    ticks: 5
                })
                .attr(JSON.attributes)
                .attr({plotValue: "weight"});
        },
        update: function(){
            d3.json('media/' + this.charts[this.chartIndex].name + '.json', function (err, JSON) {
                if(!err){
                    chartHolder
                        .data(JSON.data)
                        .call(chartHolder);
                }
            });
        }
    };
})();