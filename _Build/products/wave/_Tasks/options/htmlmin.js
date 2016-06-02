module.exports = {
	all: {
        options: {
            removeComments: true,
            collapseWhitespace: true,
            keepClosingSlash: true,
            minifyJS: true
        },
        files: [{
            expand: true,
            cwd: '.tmp/compiled',
            src: '*.html',
            dest: '_Output'
        }]
    }
}