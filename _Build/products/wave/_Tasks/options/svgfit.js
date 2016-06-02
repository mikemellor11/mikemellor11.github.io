module.exports = {
	dist: {
        files: [{
            expand: true,
            cwd: '_Build/svg',
            src: '**/*.svg',
            dest: '.tmp/icons-fit/',
            flatten: true,
        },
        {
            expand: true,
            cwd: '_Build/icons/generated/',
            src: '**/*.svg',
            dest: '.tmp/icons-fit/',
            flatten: true,
            rename: function(dest, src) {
                return dest + src.substr(0, src.lastIndexOf(".")) + '.colors-iconColor' + '.svg';
            }
        },
        {
            expand: true,
            cwd: '_Build/icons/generated',
            src: '**/*.svg',
            dest: '.tmp/icons-fit/',
            flatten: true,
            rename: function(dest, src) {
                return dest + src.substr(0, src.lastIndexOf(".")) + '.colors-iconHover' + '.svg';
            }
        },
        {
            expand: true,
            cwd: '_Build/icons/generated',
            src: '**/*.svg',
            dest: '.tmp/icons-fit/',
            flatten: true,
            rename: function(dest, src) {
                return dest + src.substr(0, src.lastIndexOf(".")) + '.colors-iconColorFlip' + '.svg';
            }
        },
        {
            expand: true,
            cwd: '_Build/icons/generated',
            src: '**/*.svg',
            dest: '.tmp/icons-fit/',
            flatten: true,
            rename: function(dest, src) {
                return dest + src.substr(0, src.lastIndexOf(".")) + '.colors-iconHoverFlip' + '.svg';
            }
        }]
    }
}