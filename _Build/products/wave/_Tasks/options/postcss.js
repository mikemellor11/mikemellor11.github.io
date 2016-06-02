module.exports = {
	options: {
        map: false,
        processors: [
            require('autoprefixer')({browsers: 'last 6 versions'})
        ]
    },
    dist: {
        files: {
            '_Output/css/general.css': '_Output/css/general.css'
        }
    }
}