module.exports = {
	scripts: {
        files: ['_Build/js/**/*.js'],
        tasks: ['jshint', 'concat:dev', 'karma:unit:run'],
        options: {
            spawn: false,
        }
    },
    styles: {
        files: ['_Build/sass/**/*.scss'],
        tasks: ['sass:dev', 'postcss'],
        options: {
            spawn: false,
        }
    },
    html: {
        files: ['_Build/*.html', '_Build/*.json', '_Build/handlebars/**/*', '!_Build/handlebars/partials/generated/**/*', '_Build/media/**/*.json'],
        tasks: ['jsonlint', 'tv4', 'compile-handlebars', 'includereplace', 'htmlmin', 'clean:build'],
        options: {
            spawn: false,
        }
    },
    assets: {
        files: ['_Build/media/**/*'],
        tasks: ['copy:assets'],
        options: {
            spawn: false,
        }
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
        tasks: ['casperjs:local'],
        options: {
            spawn: false,
        }
    },
    unitTests: {
        files: ['_Test/karma/**/*'],
        tasks: ['karma:unit:run'],
        options: {
            spawn: false,
        }
    }
}