module.exports = {
	myIcons: {
        files: [{
            expand: true,
            cwd: '.tmp/icons/',
            src: ['*.svg', '*.png'],
            dest: "_Output/svg"
        }],
        options: {
            defaultWidth: "<%= icons.iconSize %>",
            defaultHeight: "<%= icons.iconSize %>",
            dynamicColorOnly: true,
            colors: {
                color1: "<%= icons.color1 %>",
                color2: "<%= icons.color2 %>",
                color3: "<%= icons.color3 %>",
                iconColor: "<%= icons.iconColor %>",
                iconHover: "<%= icons.iconHover %>",
                iconColorFlip: "<%= icons.iconColorFlip %>",
                iconHoverFlip: "<%= icons.iconHoverFlip %>"
            },
            customselectors: {
                "times-color1": [".icon-times-color3:hover"],
                "__right-sml-color1": [".owl-next:hover .icon-__right-sml-color3"],
                "__left-sml-color1": [".owl-prev:hover .icon-__left-sml-color3"]
            },
            template: "_Build/handlebars/grunticon.hbs"
        }
    }
}