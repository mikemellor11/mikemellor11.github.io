module.exports = {
    options: {
        spawn: false
    },
	scripts: {
        files: ['_Build/js/**/*.js'],
        tasks: ['jshint', 'concat:dev', 'karma:unit:run']
    },
    styles: {
        files: ['_Build/sass/**/*.scss'],
        tasks: ['sass:dev', 'postcss']
    },
    html: {
        files: ['_Build/*.html', '_Build/*.json', '_Build/handlebars/**/*', '!_Build/handlebars/partials/generated/**/*', '_Build/media/**/*.json'],
        tasks: ['jsonlint', 'tv4', 'compile-handlebars', 'htmlmin', 'clean:build']
    },
    assets: {
        files: ['_Build/media/**/*'],
        tasks: ['copy:assets']
    },
    svg: {
        files: ['_Build/svg/**/*', '_Build/icons/**/*'],
        tasks: ['fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:svg', 'clean:build'],
        options: {
            spawn: false
        }
    },
    smokeTests: {
        files: ['_Test/casperjs/modules/**/*.js'],
        tasks: ['casperjs:local']
    },
    unitTests: {
        files: ['_Test/karma/**/*'],
        tasks: ['karma:unit:run']
    }
}