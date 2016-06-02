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
        files: {
            '_Output/css/general.css': '_Build/sass/general.scss'
        }
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
                '_Output/css/general.css': '_Build/sass/general.scss'
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