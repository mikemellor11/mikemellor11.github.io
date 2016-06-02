module.exports = function(grunt) {

    // Load all grunt npm tasks with the prefix 'grunt-'
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jsonlint: require('./_Tasks/options/jsonlint'),
        tv4: require('./_Tasks/options/tv4')
    });

    var allGoodTests = ['jsonlint', 'tv4', 'allGood'];

    grunt.registerTask('default', function(){
        // Second phase config values that need content.json to be linted and scheme'd before initializing
        grunt.registerTask('allGood', function(){

            buildCommands(grunt);

            grunt.task.run(['convert', 'sass:dev', 'postcss', 'jshint', 'modernizr', 'concat:dev', 'copy', 'fontello_svg', 'svgfit', 'svgmin', 'grunticon', 'image_resize', 'includereplace', 'compile-handlebars', 'htmlmin', 'special-html', 'clean:build', 'browserSync', 'watch']);
        });

        grunt.task.run(allGoodTests);
    });

    grunt.registerTask('dist', function(){

        grunt.registerTask('allGood', function(){
            buildCommands(grunt);

            grunt.task.run(['clean:dist', 'convert', 'sass:dist', 'postcss', 'jshint', 'modernizr', 'concat:dist', 'uglify:dist', 'copy', 'fontello_svg', 'svgfit', 'svgmin', 'grunticon', 'image_resize', 'includereplace', 'compile-handlebars', 'htmlmin', 'special-html', 'imagemin', 'clean:build', 'connect', 'casperjs:local', 'karma:continuous', 'compress']);
        });

        grunt.task.run(allGoodTests);
    });

    grunt.registerTask('content', function(){

        grunt.registerTask('allGood', function(){
            buildCommands(grunt);
        });

        grunt.task.run(allGoodTests);
    });

    grunt.registerTask('deploy', function(){

        grunt.registerTask('allGood', function(){
            buildCommands(grunt);

            grunt.task.run('ftpscript:internal', 'casperjs:dist', 'gitLog', 'grunt nodemailer:internal');
        });

        grunt.task.run(allGoodTests);
    });

    grunt.registerTask('deploy', function(){

        grunt.registerTask('allGood', function(){
            buildCommands(grunt);

            grunt.task.run('ftpscript:internal', 'casperjs:dist', 'gitLog', 'nodemailer:internal');
        });

        grunt.task.run(allGoodTests);
    });

    grunt.registerTask('deployLive', function(){

        grunt.registerTask('allGood', function(){
            buildCommands(grunt);

            grunt.task.run('ftpscript:internal', 'casperjs:dist', 'ftpscript:external', 'ftpscript:autoPackage', 'gitLog', 'nodemailer:external');
        });

        grunt.task.run(allGoodTests);
    });
};

function buildCommands(grunt){

    require('./_Tasks/helpers/include.js')(grunt);

    // Load all custom tasks found in _Tasks
    grunt.loadTasks('_Tasks');

    // Always need to have content to init some tasks
    grunt.task.run(['content']);

    grunt.registerTask('done', function(){
        // Third phase config values that need content to initialize

        var parseString = require('xml2js').parseString;
        var xmlJson = [];

        var players = [];        
        for(var i = 0; i < contentJson.content.length; i++){
            var contentName = contentJson.content[i].url;
            var playerName = (contentName !== null && contentName !== undefined) ? contentName : 'player'+i;
            players.push(playerName);

            parseString(grunt.file.read('_Build/xml/' + playerName + '/' + contentJson.content[i].slideXml), function (err, result) {
                xmlJson.push(result);
            });
        }

        grunt.config.set('casperjs', {
            options: {
                casperjsOptions: [
                    '--url=' + String.format(contentJson.attributes.local.url, getIP(), ('~' + process.env.USER)),
                    '--players=' + JSON.stringify(players),
                    '--contentJson=' + JSON.stringify(contentJson),
                    '--playerJson=' + xmlJson
                ]
            },
            dist: {
                options: {
                    casperjsOptions: [
                        '--url=' + contentJson.attributes.internal.url,
                        '--players=' + JSON.stringify(players),
                        '--contentJson=' + JSON.stringify(contentJson),
                        '--playerJson=' + xmlJson
                    ]
                },
                src: ['_Test/casperjs/*.js']
            },
            local: {
                src: ['_Test/casperjs/*.js']
            }
        });

        watchSmokeTests();
    });

    var icons = {
        color1: getSassVariable('$color1', grunt.file.read('_Build/sass/_variables.scss')),
        color2: getSassVariable('$color2', grunt.file.read('_Build/sass/_variables.scss')),
        color3: getSassVariable('$color3', grunt.file.read('_Build/sass/_variables.scss')),
        iconColor: getSassVariable(getSassVariable('$iconColor', grunt.file.read('_Build/sass/_variables.scss')), grunt.file.read('_Build/sass/_variables.scss')),
        iconHover: getSassVariable(getSassVariable('$iconHover', grunt.file.read('_Build/sass/_variables.scss')), grunt.file.read('_Build/sass/_variables.scss')),
        iconColorFlip: getSassVariable(getSassVariable('$iconColorFlip', grunt.file.read('_Build/sass/_variables.scss')), grunt.file.read('_Build/sass/_variables.scss')),
        iconHoverFlip: getSassVariable(getSassVariable('$iconHoverFlip', grunt.file.read('_Build/sass/_variables.scss')), grunt.file.read('_Build/sass/_variables.scss')),
        iconSize: (parseInt(getSassVariable('$iconSize', grunt.file.read('_Build/sass/_variables.scss'))) * 2) + 'px'
    };

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        contentJson: contentJson,
        touring: touring,
        icons: icons
    };

    grunt.util._.extend(config, loadConfig('./_Tasks/options/'));

    grunt.initConfig(config);

    var customSelectors = buildGruntIconColors();

    buildPlayerHtml();

    if(touring){
        setupTour();
    }

    // Need to run everytime regardless of task - allows watch to still work on tests
    grunt.task.run('karma:unit:start');
}

function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {cwd: path}).forEach(function(option) {
        key = option.replace(/\.js$/,'');
        object[key] = require(path + option);
    });

    return object;
}