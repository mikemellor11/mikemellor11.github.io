module.exports = {
	global: {
        options: {
            root: function(){return require('grunt').file.readJSON('_Build/schemas/schema.json')},
            banUnknown: true
        },
        "src": ["_Build/content.json", "_Build/example/content.json"]
    }
}