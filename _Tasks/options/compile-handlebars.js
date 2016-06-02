module.exports = {
	all: {
        'files': [{
            expand: true,
            cwd: '_Build/',
            src: ['*.html'],
            dest: '.tmp/includeReplaced/'
        }],
        'templateData': '_Build/content.json',
        'helpers': '_Build/handlebars/helpers/**/*.js',
        'partials': [
            '_Build/handlebars/partials/**/*.{hbs,svg,html}', 
            '_Build/handlebars/pages/**/*.{hbs,svg,html}',
            '_Build/handlebars/posts/**/*.{hbs,svg,html}'
        ],
        'globals': []
    }
}