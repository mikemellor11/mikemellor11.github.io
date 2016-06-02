module.exports = {
	options: {
        map: false,
        processors: [
            require('autoprefixer')({browsers: 'last 6 versions'}),
            require('postcss-assets')({
                basePath: '_Output/',
                relativeTo: 'css/',
                loadPaths: ['media/**/']
            })
        ]
    },
    dist: {
        files: {
            '_Output/css/general.css': '_Output/css/general.css'
        }
    }
}