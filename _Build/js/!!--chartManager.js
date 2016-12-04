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

        htmlList: function(selector, array){
            var html = '';

            array.forEach(function(d, i){
                html += '<li' + ((!i) ? ' class="externalLink"' : '') + '>' + d + '</li>';
            });

            d3.select(selector).html(html);
        },

        htmlWorkout: function(selector, workouts){
            var thead = '<thead>';
            thead += '<tr>';
            thead += '<th>Exercise</th>';
            for(var j = 0; j < 9; j++){
                thead += '<th>' + j + '</th>';
            }
            thead += '<th>Volume</th>';
            thead += '<th>Target Hit</th>';
            thead += '<th>Intensity</th>';
            thead += '</tr>';
            thead += '</thead>';

            var tbody = '<tbody>';

            workouts.each(function(d, i){
                tbody += '<tr>';

                tbody += '<td data-label="Exercise">' + d.exercise() + '</td>';

                var sets = d.sets().weight();
                for(var j = 0; j < 9; j++){
                    tbody += '<td data-label="Set ' + (j + 1);
                    if(j < sets.length){
                        tbody += '">' + sets[j];
                    } else {
                        tbody += '" class="table__empty">';
                    }
                    tbody += '</td>';
                }

                tbody += '<td data-label="Volume">' + d.volume() + '</td>';

                var icon = 'cancel-circle';

                if(d.target()){
                    icon = 'ok-circle';
                }

                tbody += '<td data-label="Target Hit">' + '<div class="icon icon--small"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#' + icon + '"></use></svg></div>' + '</td>';

                tbody += '<td data-label="Intensity">' + d.intensity() + '</td>';

                tbody +='</tr>';
            });

            tbody += '</tbody>';

            d3.select(selector).html('<colgroup span="13"></colgroup>' + thead + tbody);
        }
    };
})();