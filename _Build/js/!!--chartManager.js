var chartManager = (function() {
    "use strict";

    var chartHolder = null;
    var globalAttr = {
        colors: ['fill1', 'fill2', 'fill3', 'fill4', 'fill5', 'fill6', 'fill7', 'fill8'],
        yLabel: "Volume (kg)",
        xLabel: "Date",
        margin: {
            right: 40,
            left: 80
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
        all: [],
        init: function(cb){
            var index = 0;

            chartManager.charts.forEach(function(d, i){
                d3.json('media/data/' + d.name + '.json', function(err, JSON){
                    if(err){
                        console.log("error: ", err);
                    }

                    chartManager[d.name] = JSON;

                    chartManager.all = chartManager.all.concat(JSON);

                    if (index++ === chartManager.charts.length - 1){ 
                        cb();
                    }
                });
            });
        },
        update: function(){
            /*d3.json('media/data/' + this.charts[this.chartIndex].name + '.json', function (err, JSON) {
                if(!err){

                    var data = [];

                    JSON.forEach(function(d, i){
                        if(d.sessions){
                            var workout = Workout(d.sessions);

                            var exercise = {
                                "label": d.exercise,
                                "values": []
                            };

                            d.sessions.forEach(function(dl, il){
                                exercise.values.push({
                                    "id": dl.date,
                                    "value": Set(dl.sets).max(),
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
            });*/
        },

        htmlList: function(selector, array){
            var html = '';

            array.forEach(function(d){
                html += '<li>' + d + '</li>';
            });

            d3.select(selector).html(html);
        }
    };
})();