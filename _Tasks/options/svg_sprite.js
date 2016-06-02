module.exports = {
	global: {
        expand: true,
        cwd: '.tmp/icons/',
        src: ['**/*.svg'],
        dest: '_Build/handlebars/partials/generated/',
        options: {
            mode: {
                symbol: {
                    sprite: "svgSprite.svg",
                    dest: ""
                }
            },
            svg: {
                rootAttributes: {
                    "id": "svgSprite"
                },
                xmlDeclaration : false,
                doctypeDeclaration : false
            }
        }
    }
}