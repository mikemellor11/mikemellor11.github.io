module.exports = function(grunt) {

    require('./_Tasks/helpers/include.js')(grunt);

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        contentJson: grunt.file.readJSON('_Build/content.json')
    };

    grunt.util._.extend(config, loadConfig('./_Tasks/options/'));

    grunt.initConfig(config);

    // Load all grunt npm tasks with the prefix 'grunt-'
    require('load-grunt-tasks')(grunt);

    // Load all custom tasks found in _Tasks
    grunt.loadTasks('_Tasks');

    watchSmokeTests();

    grunt.registerTask('default', ['karma:unit:start', 'jshint', 'tv4', 'concat:dev', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy', 'sass:dev', 'postcss', 'compile-handlebars', 'htmlmin', 'clean:build', 'browserSync:dev', 'connect', 'watch']);
    
    grunt.registerTask('dist', ['clean:dist', 'jshint', 'tv4', 'concat:dist', 'uglify:dist', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy', 'sass:dist', 'postcss', 'compile-handlebars', 'htmlmin', 'imagemin', 'clean:build', 'connect', 'casperjs:local', 'karma:continuous']);

    grunt.registerTask('validate', ['jshint', 'tv4', /*'htmllint', */'connect', 'casperjs:local', 'karma:continuous']);
};

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