module.exports = {
	stripAll: {
        options: {
            plugins: [
                { removeDimensions: true, },
                { removeStyleElement: true },
                { removeUselessStrokeAndFill: true },
                { removeAttrs: {attrs: '(stroke|fill)'} }
            ]
        },
        expand: true,
        cwd: '.tmp/icons-fit/', // __ svg files will be left alone, all other svg files will be completely stripped
        src: ['**/*.svg', '!**/__*.svg'],
        dest: '.tmp/icons/'
    },
    stripAllSome: {
        options: {
            plugins: [
                { removeDimensions: true, }
            ]
        },
        expand: true,
        cwd: '.tmp/icons-fit/',
        src: ['**/__*.svg'],
        dest: '.tmp/icons/'
    }
}