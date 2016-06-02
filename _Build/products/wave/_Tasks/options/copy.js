module.exports = {
	assets: {
        files: [{
            expand: true,
            cwd: '_Build/media/',
            src: ['**/*'],
            dest: '_Output/media/'
        }]
    },
    mediaElement: {
        files: [{
            expand: true,
            cwd: '_Build/mediaElement/',
            src: ['**/*'],
            dest: '_Output/build/'
        }]
    },
    htaccess: {
        files: {
            '_Output/.htaccess': ['_Build/.htaccess']
        }
    },
    content: {
        files: [{
            expand: true,
            cwd: '_Build/content/xml',
            src: ['**/*'],
            dest: '_Build/xml/'
        },
        {
            expand: true,
            cwd: '_Build/content/slides',
            src: ['**/*'],
            dest: '_Build/media/slides/'
        },
        {
            expand: true,
            cwd: '_Build/content/media',
            src: ['**/*'],
            dest: '_Build/media/'
        }]
    }
}