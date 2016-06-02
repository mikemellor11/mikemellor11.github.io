module.exports = function(grunt) {
    grunt.registerTask('gitLog', function(){

        var done = this.async();

        var gitlog = require('gitlog');
        var options = { 
            repo: __dirname,
            number: 5,
            fields: [ 'hash', 'subject', 'abbrevHash', 'committerName', 'committerDateRel']
        };

        var colors = ['red', 'blue', 'green', 'purple', '#FF5516'];

        gitlog(options, function(error, commits) {
            for(var i = 0, len = commits.length; i < len; i++){
                gitLogString += '<li style="color: ' + colors[i % colors.length] + ';"><b>Commit: </b>' + commits[i].hash + '<ul style="color: black;">';

                gitLogString += '<li><b>Name: </b>' + commits[i].committerName + '</li>';
                gitLogString += '<li><b>Date: </b>' + commits[i].committerDateRel + '</li>';
                gitLogString += '<li><b>Message: </b>' + commits[i].subject + '</li>';

                gitLogString += '</ul></li>';
            }
            done();
        });
    });
};