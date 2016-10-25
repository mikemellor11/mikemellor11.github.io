module.exports = function(grunt) {
    this.modifyJson = function(json, data, socket, level, callback){
        json.forEach(function(d, i){
            if(d.exercise === data.exercise){
                if(level === 'exerciseLevel'){
                    callback(d, i);
                    level = 'done';
                }
            }
        });

        saveJson(json, data);

        socket.emit('update');
    }

    this.saveJson = function(json, data){
        fs.writeFile('_Build/media/data/' + data.group + '.json', JSON.stringify(json, null, 4), function (err) {
            if (err) return console.log(err);
            console.log('Saved');
        });
    }

    this.exitHandler = function(options, err) {
        if(options.socket){
            options.socket.emit('closeWindow');
        }
        if (options.cleanup) console.log('clean');
        if (err) console.log(err.stack);
        if (options.exit) process.exit();
    }
}