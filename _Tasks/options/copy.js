module.exports = {
	assets: {
        files: [{
            expand: true,
            cwd: '_Build/media/',
            src: ['**/*'],
            dest: '_Output/media/'
        }]
    },
    products: {
        files: [{
            expand: true,
            cwd: '_Build/products/',
            src: ['*/_Output/**'],
            dest: '_Output/products'
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
            '_Output/.htaccess': ['_Build/.htaccess']
        }
    }
}