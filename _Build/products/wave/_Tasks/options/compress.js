module.exports = {
	production: {
        options: {
            mode: 'gzip'
        },
        expand: true,
        cwd: '_Output/',
        src: ['**/*'],
        dest: '_Production/'
    },
    zip: {
        options: {
            archive: '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>.zip'
        },
        files: [
            {
                expand: true,
                cwd: '_Output/',
                src: ['**/*'],
                dest: './'
            }
        ]
    }
}