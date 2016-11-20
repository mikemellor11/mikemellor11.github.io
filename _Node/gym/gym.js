require('../../_Tasks/helpers/include.js')();
var moment = require('moment');
require('./server.js')();
require('./functions.js')();

io.on('connection', function (socket) {
	socket.on('closeWindow', function(){
		exitHandler({exit:true});
	});

    socket.on('saveLift', function(data){
        modifyJson(JSON.parse(fs.readFileSync('_Build/media/data/' + data.group + '.json')), data, socket, 'exerciseLevel', function(d, i){

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
        modifyJson(JSON.parse(fs.readFileSync('_Build/media/data/' + data.group + '.json')), data, socket, 'exerciseLevel', function(d, i){

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