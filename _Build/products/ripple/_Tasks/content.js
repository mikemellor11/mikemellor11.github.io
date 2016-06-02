module.exports = function(grunt) {
    grunt.registerTask('content', "Checks if xml exists, if not run get content task, this is because some tasks rely on the xml being there already so can't run", function(){

        var dist = grunt.option('dist') || false;

        grunt.config.set('shell', {
            options: {
                execOptions: {
                    maxBuffer: 20000 * 1024
                },
                stderr: true,
                stdout: true
            },
            content: {
                command: ('wget -r --user=\"mmellor\" --password=\"13Orange02\" --no-passive-ftp -P ./_Build/ -nH --cut ' + contentJson.attributes.content.cut + ' ftp://10.1.8.4/' + contentJson.attributes.content.ftp)
            }
        });

        if(dist || !fileExists('xml', '_Build/', grunt)){
            grunt.task.run('shell:content', 'done');
        } else {
            grunt.task.run('done');
        }
    });
};