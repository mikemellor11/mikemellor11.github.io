module.exports = {
	dev: {
        bsFiles: {
            src : [
                '_Output/css/*.css',
                '_Output/*.html',
                '_Output/js/*.js',
                '_Output/media/**/*.{png,jpg,jpeg,gif,JPG,JPEG,PNG,GIF}',
                '_Output/svg/**/*.{png,jpg,jpeg,gif,JPG,JPEG,PNG,GIF}'
            ]
        },
        options: {
            watchTask: true,
            notify: true,
            open: false,
            reloadOnRestart: true,
            server: {
                baseDir: "./_Output/"
            }
        }
    }
}