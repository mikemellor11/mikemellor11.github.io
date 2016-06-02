module.exports = {
	dist: {
        files: [
        {
            '_Output/js/crucial.js': ['.tmp/js/crucial.js'],
            '_Output/js/script.js': ['.tmp/js/script.js']
        },
        {
            expand: true,
            cwd: '.tmp/js',
            src: ['**/*.js', '!crucial.js', '!script.js'],
            dest: '_Output/js/',
            flatten: true
        }]
    }
}