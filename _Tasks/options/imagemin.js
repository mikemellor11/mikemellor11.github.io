module.exports = {
	all: {
        files: [{
            expand: true,
            cwd: '_Output/media/',
            src: ['**/*.{png,jpg,jpeg,gif}'],
            dest: '_Output/media/'
        }]
    }
}