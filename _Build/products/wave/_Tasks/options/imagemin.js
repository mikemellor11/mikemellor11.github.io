module.exports = {
	all: {
        files: [{
            expand: true,
            cwd: '_Output/',
            src: ['**/*.{png,jpg,jpeg,gif}'],
            dest: '_Output/'
        }]
    }
}