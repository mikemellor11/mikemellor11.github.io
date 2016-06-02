module.exports = {
	all: {
        'files': [{
            expand: true,
            cwd: '.tmp/includeReplaced/',
            src: ['*.html'],
            dest: '.tmp/compiled/'
        }],
        templateData: "*.json",
        'globals': [
            contentPath, 
            {
                "tour": (touring) ? "<%= JSON.stringify((grunt.file.readJSON('_Tour/tour.json')), null, 4) %>" : false
            }
        ],
        'helpers': '_Build/handlebars/helpers/**/*.js',
        'partials': '_Build/handlebars/partials/**/*.html'
    }
}