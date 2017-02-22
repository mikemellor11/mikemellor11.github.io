module.exports = function(grunt) {

    require('./_Tasks/helpers/include.js')(grunt);

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        contentJson: grunt.file.readJSON('_Build/content.json')
    };

    grunt.util._.extend(config, loadConfig('./_Tasks/options/'));

    grunt.initConfig(config);

    // CONCAT/UGLIFY DYNAMIC
    grunt.file.expand({cwd: '_Build/js/', flatten: true}, '**/++*.js').forEach(function(d){
        var file = d.slice(d.indexOf('++') + 2);
        var group = file.slice(0, file.indexOf('.'));

        config.concat.dev.files[0]['public/js/' + group + '.js'] = '_Build/js/**/' + group + '*.js';
        config.concat.dist.files[0]['.tmp/js/' + group + '.js'] = '_Build/js/**/' + group + '*.js';
    });

    // Load all grunt npm tasks with the prefix 'grunt-'
    require('jit-grunt')(grunt);

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