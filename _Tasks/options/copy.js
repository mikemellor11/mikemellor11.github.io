module.exports = {
	assets: {
        files: [{
            expand: true,
            cwd: '_Build/media/',
            src: ['**/*'],
            dest: '_Output/media/'
        }]
    },
    svg: {
        files: [{
            expand: true,
            cwd: '.tmp/icons/',
            src: ['**/*'],
            dest: '_Build/handlebars/partials/generated/embed/'
        }]
    },
    htaccess: {
        files: {
            '_Output/.htaccess': ['_Build/.htaccess'],
            '_Output/CNAME': ['_Build/CNAME']
        }
    }
}