module.exports = function(grunt) {
    this.fs = require('fs');
    this.http = require('http');
    this.opn = require('opn');
    this.url = require('url');
    this.path = require('path');
    this.io = require('socket.io')(http.createServer(function(req, res) {
    	var tempPath = url.parse(req.url).pathname;

    	switch(tempPath){
            case '/':
    			fs.readFile(__dirname + '/index.html', function(error, data){
                    if (error){
                        res.writeHead(404);
                        res.write("opps this doesn't exist - 404");
                        res.end();
                    }
                    else{
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(data, "utf8");
                        res.end();
                    }
                });
                break;
            case '/general.css':
    			fs.readFile(__dirname + '/../../_Output/css/general.css', function(error, data){
                    if (error){
                        res.writeHead(404);
                        res.write("opps this doesn't exist - 404");
                        res.end();
                    }
                    else{
                        res.writeHead(200, {'Content-Type': 'text/css'});
                        res.write(data, "utf8");
                        res.end();
                    }
                });
                break;
            case '/script.js':
                fs.readFile(__dirname + '/../../_Output/js/script.js', function(error, data){
                    if (error){
                        res.writeHead(404);
                        res.write("opps this doesn't exist - 404");
                        res.end();
                    }
                    else{
                        res.writeHead(200, {'Content-Type': 'application/javascript'});
                        res.write(data, "utf8");
                        res.end();
                    }
                });
                break;
            case '/crucial.js':
                fs.readFile(__dirname + '/../../_Output/js/crucial.js', function(error, data){
                    if (error){
                        res.writeHead(404);
                        res.write("opps this doesn't exist - 404");
                        res.end();
                    }
                    else{
                        res.writeHead(200, {'Content-Type': 'application/javascript'});
                        res.write(data, "utf8");
                        res.end();
                    }
                });
                break;
            default:
                if(path.extname(tempPath) === '.json'){
                    fs.readFile(__dirname + '/../../_Build' + tempPath, function(error, data){
                        if (error){
                            res.writeHead(404);
                            res.write("opps this doesn't exist - 404");
                            res.end();
                        }
                        else{
                            res.writeHead(200, {"Content-Type": 'application/json'});
                            res.write(data, "utf8");
                            res.end();
                        }
                    });
                } else {
                    fs.readFile(__dirname + tempPath, function(error, data){
                        if (error){
                            res.writeHead(404);
                            res.write("opps this doesn't exist - 404");
                            res.end();
                        }
                        else{
                            var ext = path.extname(tempPath);
                            switch(ext){
                                case '.svg':
                                    res.writeHead(200, {"Content-Type": 'image/svg+xml'});
                                    break;
                                case '.css':
                                    res.writeHead(200, {"Content-Type": 'text/css'});
                                    break;
                                case '.js':
                                    res.writeHead(200, {"Content-Type": "application/javascript"});
                                    break;
                                default:
                                    res.writeHead(200, {"Content-Type": 'text/html'});
                                    break;
                            }
                            res.write(data, "utf8");
                            res.end();
                        }
                    });
                }
                break;
        }
    }).listen(8888, '127.0.0.1'));

    opn('http://127.0.0.1:8888');
}