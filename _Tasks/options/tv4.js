module.exports = {
	options: {
        root: function(){return require('grunt').file.readJSON('_Build/schemas/schema.json')},
        banUnknown: true
    },
    all: {
    	"src": ["_Build/content.json"]
    }
}