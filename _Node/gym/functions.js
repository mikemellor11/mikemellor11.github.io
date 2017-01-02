module.exports = function(grunt) {
    this.fs = require('fs');
    this.http = require('http');
    this.opn = require('opn');
    this.url = require('url');
    this.path = require('path');
    
    this.modifyJson = function(json, data, socket, level, callback){
        json.forEach(function(d, i){
            if(d.exercise === data.exercise){
                if(level === 'exerciseLevel'){
                    callback(d, i);
                    level = 'done';
                }
            }
        });

        saveJson(json, data.group);

        socket.emit('update');
    }

    this.saveJson = function(json, file){
        fs.writeFile('_Build/media/data/' + file + '.json', JSON.stringify(json, null, 4), function (err) {
            if (err) return console.log(err);
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

    this.loadJson = function(file) {
        return JSON.parse(fs.readFileSync('_Build/media/data/' + file + '.json'));
    }
}