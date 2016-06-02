module.exports = {
	options: {
        separator: ';',
    },
    dev: {
        files: [
        {
            '_Output/js/crucial.js': ['_Build/js/**/__*.js', '_Build/js/**/!!__*.js'], // !! makes sure they come last regardless of other prefixes, __ puts them in crucial.js, -- puts them in script.js
            '_Output/js/script.js': ['_Build/js/**/--*.js', '_Build/js/**/!!--*.js'] // No prefix will save the js as it's own standalone file
        },
        {
            expand: true,
            cwd: '_Build/js/',
            src: ['**/*.js', '!**/__*.js', '!**/--*.js', '!**/!!*.js'],
            dest: '_Output/js/',
            flatten: true
        }]
    },
    dist: {
        files: [
        {
            '.tmp/js/crucial.js': ['_Build/js/**/__*.js', '_Build/js/**/!!__*.js'],
            '.tmp/js/script.js': ['_Build/js/**/--*.js', '_Build/js/**/!!--*.js']
        },
        {
            expand: true,
            cwd: '_Build/js/',
            src: ['**/*.js', '!**/__*.js', '!**/--*.js', '!**/!!*.js'],
            dest: '.tmp/js/',
            flatten: true
        }]
    }
}