module.exports = {
	stripAll: {
        options: {
            plugins: [
                { removeDimensions: true, },
                { removeXMLProcInst: false }, // Don't remove XML declaration (needed to avoid errors creating PNG on Win 7)
                { removeStyleElement: true }
            ]
        },
        files: [{
            expand: true,
            cwd: '.tmp/icons-fit/',
            src: ['*.svg', '!__*.svg'],
            dest: '.tmp/icons/'
        }]
    },
    stripAllSome: {
        options: {
            plugins: [
                { removeXMLProcInst: false } // Don't remove XML declaration (needed to avoid errors creating PNG on Win 7)
            ]
        },
        files: [{
            expand: true,
            cwd: '.tmp/icons-fit/',
            src: ['__*.svg'],
            dest: '.tmp/icons/'
        }]
    }
}