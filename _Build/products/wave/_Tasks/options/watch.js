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
        files: ['_Build/*.html', '_Build/*.json', '_Build/example/*.json', '_Build/xml/*.xml', '_Build/handlebars/**/*', '_Tour/**/*.json'],
        tasks: ['jsonlint', 'tv4', 'convert', 'copy', 'includereplace', 'compile-handlebars', 'htmlmin', 'special-html', 'clean:build'],
        options: {
            spawn: false,
        }
    },
    assets: {
        files: ['_Build/media/**/*'],
        tasks: ['copy:assets', 'image_resize'],
        options: {
            spawn: false,
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