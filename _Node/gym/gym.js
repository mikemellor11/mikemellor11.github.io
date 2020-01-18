require('@fishawack/config-grunt/_Tasks/helpers/include.js')();
require('./functions.js')();

var moment = require('moment');
var today = moment().format('DD/MM/YYYY');
var stdio = require('stdio');

var weightJson = loadJson('weight');
var foodJson = loadJson('food');

var lastKg = weightJson[weightJson.length - 1].weight;

if(process.argv[2] === 'cardio'){
    stdio.question('Weight (' + lastKg + 'kg)', function (err, vers) {
        if(vers.length <= 0){}
        else if(isNaN(vers)){
            console.log("Enter a valid number without units e.g 80");
            return;
        } else {
            lastKg = +vers;
        }

        stdio.question('Cardio (0 mins)', function (err, vers) {
            if(vers.length <= 0){}
            else if(isNaN(vers)){
                console.log("Enter a valid number without units e.g 80");
                return;
            }

            weightJson.push({
                date: today,
                weight: lastKg,
                food: calculateFood(foodJson),
                cardio: +vers
            });

            saveJson(weightJson, 'weight');
        });
    });
} else if(weightJson[weightJson.length - 1].date !== today && process.argv[2] !== 'skip'){
    stdio.question('Weight (' + lastKg + 'kg)', function (err, vers) {
        if(vers.length <= 0){}
        else if(isNaN(vers)){
            console.log("Enter a valid number without units e.g 80");
            return;
        } else {
            lastKg = +vers;
        }

        weightJson.push({
            date: today,
            weight: lastKg,
            food: calculateFood(foodJson)
        });

        saveJson(weightJson, 'weight');

        init();
    });
} else {
    init();
}

function init(){
    require('./server.js')();

    this.io.on('connection', function (socket) {
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

        socket.on('saveFood', function(data){
            for(var key in foodJson){
                foodJson[key].weight = data[key].weight;
            }

            saveJson(foodJson, 'food');

            socket.emit('updateFood', foodJson);
        });

        socket.on('changeConfig', function(data){
            modifyJson(loadJson(data.group), data, socket, 'exerciseLevel', function(d, i){
                for(var key in data.gymDefaults){
                    d.defaults[key] = +data.gymDefaults[key];
                }
            });
        });

        socket.on('closeWindow', function(){exitHandler({exit:true});});
        process.on('exit', exitHandler.bind(null,{cleanup:true}));
        process.on('SIGINT', exitHandler.bind(null, {exit:true, socket: socket}));
        process.on('uncaughtException', exitHandler.bind(null, {exit:true, socket: socket}));

        socket.emit('buildHtml', 
            JSON.parse(fs.readFileSync('_Build/content.json')),
            weightJson,
            foodJson
        );
    });
}