module.exports = {
	external: {
        options: {
            host: '213.229.71.134',
            port: 21,
            passive: true
        },
        files: [{
            expand: true,
            cwd: '_Output',
            src: ['**/*', '!**/.DS_Store'],
            dest: contentJson.attributes.external.ftp
        }]
    },
    internal: {
        options: {
            host: '10.1.8.4',
            port: 21,
            passive: true
        },
        files: [{
            expand: true,
            cwd: '_Output',
            src: ['**/*', '!**/.DS_Store'],
            dest: contentJson.attributes.internal.ftp
        }]
    },
    autoPackage: {
        options: {
            host: '10.1.8.4',
            port: 21,
            passive: true
        },
        files: [{
            expand: true,
            cwd: '_Zips/',
            src: ['**/*', '!**/.DS_Store'],
            dest: contentJson.attributes.autoPackage.ftp + '<%= pkg.name %>' + '/'
        }]
    }
}