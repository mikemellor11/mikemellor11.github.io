module.exports = {
	thumbs: {
        options: {
            width: 200,
            height: '',
            overwrite: true
        },
        files: [{
            expand: true,
            cwd: '_Build/media/slides/',
            src: '**/*.{png,jpg,jpeg,gif,JPG,JPEG,PNG,GIF}',
            dest: '_Output/media/slidesThumb/'
        }]
    },
    dash: {
        options: {
            width: 600,
            height: '',
            overwrite: true
        },
        files: [
        ]
    }
}