var chartManager = (function() {
    "use strict";

    var chartHolder = null;
    var globalAttr = {
        colors: ['fill1', 'fill2', 'fill3', 'fill4', 'fill5', 'fill6', 'fill7', 'fill8'],
        yLabel: "Weight (kg)",
        margin: {
            right: 40,
            bottom: 40
        },
        ticks: 5,
        plotYValue: "weight",
        plotXValue: "date",
        xScale: "date",
        transitionSpeed: 0,
        delaySpeed: 0,
        stagger: 0
    };

    return {
        charts: null,
        chartIndex: 0,
        init: function(){
            chartHolder = createLine('.chart')
                .width(document.querySelector('.delta').offsetWidth);
        },
        update: function(){
            d3.json('media/' + this.charts[this.chartIndex].name + '.json', function (err, JSON) {
                if(!err){
                    chartHolder
                        .attr(globalAttr)
                        .attr(JSON.attributes)
                        .data(JSON.data)
                        .call(chartHolder);
                }
            });
        }
    };
})();