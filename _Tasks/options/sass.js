module.exports = {
    dev: {
        options: {
            outputStyle: 'expanded',
            sourceMap: false,
            includePaths: [
                'bower_components/support-for/sass',
                'bower_components/susy/sass',
                'bower_components/compass-breakpoint/stylesheets',
                'bower_components/normalize-scss/sass'
            ]
        },
        files: [{
            expand: true,
            cwd: '_Build/sass/',
            src: ['**/*.scss', '!**/_*.scss'],
            dest: '_Output/css/',
            ext: '.css',
            flatten: true
        }]
    },
    dist: {
        options: {
            outputStyle: 'compressed',
            sourceMap: false,
            includePaths: [
                'bower_components/support-for/sass',
                'bower_components/susy/sass',
                'bower_components/compass-breakpoint/stylesheets',
                'bower_components/normalize-scss/sass'
            ]
        },
        files: [
            {
                expand: true,
                cwd: '_Build/sass/',
                src: ['**/*.scss', '!**/_*.scss'],
                dest: '_Output/css/',
                ext: '.css',
                flatten: true
            },
            {
                expand: true,
                cwd: '_Output/svg/',
                src: ['*.css'],
                dest: '_Output/svg/'
            }
        ]
    }
}