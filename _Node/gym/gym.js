require('../../_Tasks/helpers/include.js')();
require('./functions.js')();

var moment = require('moment');
var stdio = require('stdio');

var weightJson = loadJson('weight');

var lastKg = weightJson[weightJson.length - 1].weight;
var lastCal = weightJson[weightJson.length - 1].calories;

stdio.question('Weight (' + lastKg + 'kg)', function (err, vers) {
    if(vers.length <= 0){}
    else if(isNaN(vers)){
        console.log("Enter a valid number without units e.g 80");
        return;
    }
    else {
        lastKg = +vers;
    }

    stdio.question('Calories (' + lastCal + 'cal)', function (err, vers) {
        if(vers.length <= 0){}
        else if(isNaN(vers)){
            console.log("Enter a valid number without units e.g 2500");
            return;
        }
        else {
            lastCal = +vers;
        }

        weightJson.push({
            date: '03/01/2017',
            weight: lastKg,
            calories: lastCal
        });

        saveJson(weightJson, 'weight');

        require('./server.js')();

        io.on('connection', function (socket) {
        	socket.on('closeWindow', function(){
        		exitHandler({exit:true});
        	});

            socket.on('saveLift', function(data){
                modifyJson(loadJson(data.group), data, socket, 'exerciseLevel', function(d, i){

                    if(!d.sessions || d.sessions[d.sessions.length - 1].date !== moment().format('DD/MM/YYYY')){
                        if(!d.sessions){
                            d.sessions = [];
                        }

                        d.sessions.push({
                            date: moment().format('DD/MM/YYYY'),
                            sets: []
                        });
                    }

                    d.sessions[d.sessions.length - 1].sets.push({
                        "weight": +data.weight,
                        "reps": +data.reps,
                        "split":  data.split,
                        "target": data.target
                    });
                });
            });

            socket.on('changeConfig', function(data){
                modifyJson(loadJson(data.group), data, socket, 'exerciseLevel', function(d, i){

                    for(var key in data.gymDefaults){
                        d[key] = +data.gymDefaults[key];
                    }
                });
            });

        	process.on('exit', exitHandler.bind(null,{cleanup:true}));
        	process.on('SIGINT', exitHandler.bind(null, {exit:true, socket: socket}));
        	process.on('uncaughtException', exitHandler.bind(null, {exit:true, socket: socket}));

        	socket.emit('buildHtml', JSON.parse(fs.readFileSync('_Build/content.json')));
        });

    });
});