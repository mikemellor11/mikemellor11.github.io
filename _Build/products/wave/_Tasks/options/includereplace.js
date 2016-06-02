module.exports = {
	all: {
        options: {
            prefix: '<!-- @@',
            suffix: ' -->',
            globals: {
                Player_Index: ""
            }
        },
        files: [{
            expand: true,
            cwd: '_Build/',
            src: ['*.html', '!player.html'],
            dest: '.tmp/includeReplaced/'
        }]
    }
}