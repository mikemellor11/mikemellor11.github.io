var chartManager = (function() {
    "use strict";

    var chartHolder = null;
    var globalAttr = {
        colors: ['fill1', 'fill2', 'fill3', 'fill4', 'fill5', 'fill6', 'fill7', 'fill8'],
        yLabel: "Volume (kg)",
        xLabel: "Date",
        margin: {
            right: 40,
            left: 70
        },
        xTicks: 5,
        plotXValue: "date",
        xScale: "date",
        yMin: "0",
        xMax: "01/01/2017",
        symbolSize: 50
    };

    return {
        charts: null,
        chartIndex: 0,
        init: function(){
            chartHolder = createLine('.chart', true)
                .width(document.querySelector('.delta').offsetWidth);
        },
        update: function(){
            d3.json('media/data/' + this.charts[this.chartIndex].name + '.json', function (err, JSON) {
                if(!err){

                    var data = [];

                    JSON.forEach(function(d, i){
                        if(d.sessions){
                            var exercise = {
                                "label": d.exercise,
                                "values": []
                            };

                            d.sessions.forEach(function(dl, il){
                                exercise.values.push({
                                    "id": dl.date,
                                    "value": dl.sets.reduce(function(a, b){
                                        return a + b.weight;
                                    }, 0),
                                    "label": ""
                                });
                            });

                            data.push(exercise);
                        }
                    });

                    chartHolder
                        .attr(globalAttr)
                        .attr({})
                        .data(data)
                        .call(chartHolder);
                }
            });
        }
    };
})();