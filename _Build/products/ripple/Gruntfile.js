module.exports = function(grunt) {

    require('./_Tasks/helpers/include.js')(grunt);

    // Load all grunt npm tasks with the prefix 'grunt-'
    require('load-grunt-tasks')(grunt);

    // Load all custom tasks found in _Tasks
    grunt.loadTasks('_Tasks');

    var color1 = getSassVariable('$color1', grunt.file.read('_Build/sass/_variables.scss'));
    var color2 = getSassVariable('$color2', grunt.file.read('_Build/sass/_variables.scss'));
    var color3 = getSassVariable('$color3', grunt.file.read('_Build/sass/_variables.scss'));
    var iconColor = getSassVariable(getSassVariable('$iconColor', grunt.file.read('_Build/sass/_variables.scss')), grunt.file.read('_Build/sass/_variables.scss'));
    var iconHover = getSassVariable(getSassVariable('$iconHover', grunt.file.read('_Build/sass/_variables.scss')), grunt.file.read('_Build/sass/_variables.scss'));
    var iconColorFlip = getSassVariable(getSassVariable('$iconColorFlip', grunt.file.read('_Build/sass/_variables.scss')), grunt.file.read('_Build/sass/_variables.scss'));
    var iconHoverFlip = getSassVariable(getSassVariable('$iconHoverFlip', grunt.file.read('_Build/sass/_variables.scss')), grunt.file.read('_Build/sass/_variables.scss'));
    var iconSize = (parseInt(getSassVariable('$iconSize', grunt.file.read('_Build/sass/_variables.scss'))) * 2) + 'px';

    var customSelectors = buildGruntIconColors();

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        contentJson: contentJson,
        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded',
                    sourceMap: false,
                    includePaths: [
                        'bower_components/support-for/sass',
                        'bower_components/susy/sass',
                        'bower_components/compass-breakpoint/stylesheets',
                        'bower_components/normalize-scss/sass'
                    ]
                },
                files: {
                    '_Output/css/general.css': '_Build/sass/general.scss'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: false,
                    includePaths: [
                        'bower_components/support-for/sass',
                        'bower_components/susy/sass',
                        'bower_components/compass-breakpoint/stylesheets',
                        'bower_components/normalize-scss/sass'
                    ]
                },
                files: [
                    {
                        '_Output/css/general.css': '_Build/sass/general.scss'
                    },
                    {
                        expand: true,
                        cwd: '_Output/svg/',
                        src: ['*.css'],
                        dest: '_Output/svg/'
                    }
                ]
            }
        },
        postcss: {
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
        },
        concat: {
            options: {
                separator: ';',
            },
            dev: {
                files: {
                    '_Output/js/crucial.js': ['_Build/js/**/__*.js'],
                    '_Output/js/script.js': ['_Build/js/**/*.js', '!_Build/js/**/__*.js']
                }
            },
            dist: {
                files: {
                    '.tmp/js/crucial.js': ['_Build/js/**/__*.js'],
                    '.tmp/js/script.js': ['_Build/js/**/*.js', '!_Build/js/**/__*.js']
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '_Output/js/crucial.js': ['.tmp/js/crucial.js'],
                    '_Output/js/script.js': ['.tmp/js/script.js']
                }
            }
        },
        copy: {
            assets: {
                files: [{
                    expand: true,
                    cwd: '_Build/media/',
                    src: ['**/*'],
                    dest: '_Output/media/'
                }]
            },
            xml: {
                files: [{
                    expand: true,
                    cwd: '_Build/',
                    src: ['xml/**/*'],
                    dest: '_Output/'
                }]
            },
            htaccess: {
                files: {
                    '_Output/.htaccess': ['_Build/.htaccess']
                }
            }
        },
        imagemin: {
            all: {
                files: [{
                    expand: true,
                    cwd: '_Output/',
                    src: ['**/*.{png,jpg,jpeg,gif}'],
                    dest: '_Output/'
                }]
            }
        },
        includereplace: {
            all: {
                options: {
                    prefix: '<!-- @@',
                    suffix: ' -->',
                    globals: {
                    }
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/compiled/',
                    src: ['*.html'],
                    dest: '.tmp/includeReplaced/'
                }]
            }
        },
        'compile-handlebars': {
            all: {
                'files': [{
                    expand: true,
                    cwd: '_Build/',
                    src: ['*.html'],
                    dest: '.tmp/compiled/'
                }],
                'templateData': '*.json',
                'globals': [contentPath],
                'helpers': '_Build/handlebars/helpers/**/*.js',
                'partials': '_Build/handlebars/partials/**/*.html'
            }
        },
        htmlmin: {
            all: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    minifyJS: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/includeReplaced',
                    src: '*.html',
                    dest: '_Output'
                }]
            }
        },
        jshint: {
            "options": {
                "jshintrc": true
            },
            files: ['_Build/js/*.js', '!_Build/js/libs']
        },
        fontello_svg: {
            default_options: {
                options: {
                    css: false,
                    skip: false,
                    fileFormat: '{1}.svg'
                },
                config: '_Build/icons/config.json',
                dest: '_Build/icons/generated/'
            }
        },
        svgfit: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '_Build/svg',
                    src: '**/*.svg',
                    dest: '.tmp/icons-fit/',
                    flatten: true,
                },
                {
                    expand: true,
                    cwd: '_Build/icons/generated/',
                    src: '**/*.svg',
                    dest: '.tmp/icons-fit/',
                    flatten: true,
                    rename: function(dest, src) {
                        return dest + src.substr(0, src.lastIndexOf(".")) + '.colors-iconColor' + '.svg';
                    }
                },
                {
                    expand: true,
                    cwd: '_Build/icons/generated',
                    src: '**/*.svg',
                    dest: '.tmp/icons-fit/',
                    flatten: true,
                    rename: function(dest, src) {
                        return dest + src.substr(0, src.lastIndexOf(".")) + '.colors-iconHover' + '.svg';
                    }
                },
                {
                    expand: true,
                    cwd: '_Build/icons/generated',
                    src: '**/*.svg',
                    dest: '.tmp/icons-fit/',
                    flatten: true,
                    rename: function(dest, src) {
                        return dest + src.substr(0, src.lastIndexOf(".")) + '.colors-iconColorFlip' + '.svg';
                    }
                },
                {
                    expand: true,
                    cwd: '_Build/icons/generated',
                    src: '**/*.svg',
                    dest: '.tmp/icons-fit/',
                    flatten: true,
                    rename: function(dest, src) {
                        return dest + src.substr(0, src.lastIndexOf(".")) + '.colors-iconHoverFlip' + '.svg';
                    }
                }]
            }
        },
        svgmin: {
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
        },
        grunticon: { // __ only effects png, without it png will always be defaultWidth/defaultHeight instead of natural width/height
            myIcons: {
                files: [{
                    expand: true,
                    cwd: '.tmp/icons/',
                    src: ['*.svg', '*.png'],
                    dest: "_Output/svg"
                }],
                options: {
                    defaultWidth: iconSize,
                    defaultHeight: iconSize,
                    dynamicColorOnly: true,
                    colors: {
                        color1: color1,
                        color2: color2,
                        color3: color3,
                        iconColor: iconColor,
                        iconHover: iconHover,
                        iconColorFlip: iconColorFlip,
                        iconHoverFlip: iconHoverFlip
                    },
                    customselectors: customSelectors,
                    template: "_Build/handlebars/grunticon.hbs"
                }
            }
        },
        watch: { // Can't watch grunticon yet, doesn't reload its files on watch, just says can't find anything
            scripts: {
                files: ['_Build/js/**/*.js'],
                tasks: ['jshint', 'concat:dev', 'karma:unit:run'],
                options: {
                    spawn: false,
                }
            },
            styles: {
                files: ['_Build/sass/**/*.scss'],
                tasks: ['sass:dev', 'postcss'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: ['_Build/*.html', '_Build/*.json', '_Build/example/*.json', '_Build/xml/*.xml', '_Build/handlebars/**/*'],
                tasks: ['copy', 'compile-handlebars', 'includereplace', 'htmlmin', 'special-html', 'clean:build'],
                options: {
                    spawn: false,
                }
            },
            assets: {
                files: ['_Build/media/**/*'],
                tasks: ['copy:assets'],
                options: {
                    spawn: false,
                }
            },
            smokeTests: {
                files: ['_Test/casperjs/modules/**/*.js'],
                tasks: ['casperjs:local'],
                options: {
                    spawn: false,
                }
            },
            unitTests: {
                files: ['_Test/karma/**/*'],
                tasks: ['karma:unit:run'],
                options: {
                    spawn: false,
                }
            }
        },
        clean: {
            build: [".tmp"],
            dist: ["_Output", "**/generated/**/*", "_Build/content"]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                singleRun: false
            },
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS', 'Firefox', 'Chrome', 'Safari', 'Opera']
            }
        },
        modernizr: {
            dist: {
                "dest" : "_Build/js/generated/__modernizr-custom.js",
                "tests": contentJson.attributes.modernizr,
                "options": [
                    "html5shiv",
                    "setClasses"
                ],
                "uglify": true,
                "crawl" : false
            }
        },
        ftpscript: {
            external: {
                options: {
                    host: '213.229.71.134',
                    port: 21,
                    passive: true
                },
                files: [{
                    expand: true,
                    cwd: '_Output',
                    src: ['**/*', '!**/.DS_Store'],
                    dest: contentJson.attributes.external.ftp
                }]
            },
            internal: {
                options: {
                    host: '10.1.8.4',
                    port: 21,
                    passive: true
                },
                files: [{
                    expand: true,
                    cwd: '_Output',
                    src: ['**/*', '!**/.DS_Store'],
                    dest: contentJson.attributes.internal.ftp
                }]
            },
            autoPackage: {
                options: {
                    host: '10.1.8.4',
                    port: 21,
                    passive: true
                },
                files: [{
                    expand: true,
                    cwd: '_Zips/',
                    src: ['**/*', '!**/.DS_Store'],
                    dest: contentJson.attributes.autoPackage.ftp + '<%= pkg.name %>' + '/'
                }]
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        },
        compress: {
            production: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: '_Output/',
                src: ['**/*'],
                dest: '_Production/'
            },
            zip: {
                options: {
                    archive: '_Zips/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: '_Output/',
                        src: ['**/*'],
                        dest: './'
                    }
                ]
            }
        },
        nodemailer: {
            options: {
                transport: require('nodemailer').createTransport('smtps://fishawack.auto.package%40gmail.com:13Orange02@smtp.gmail.com').transporter,
                recipients: "<%= contentJson.attributes.autoEmail %>"
            },
            internal: {
                options: {
                    message: {
                        from: "fishawack.auto.package@gmail.com",
                        subject: 'Auto-package:Internal: <%= pkg.name %> - <%= contentJson.attributes.title %>',
                        html: '<body>\
                            <h2><%= pkg.name %></h2> \
                            <ul> \
                                <li><strong>Instance name</strong>: <%= contentJson.attributes.title %></li> \
                                <li><strong>Build version</strong>: <%= pkg.version %></li> \
                                <li><strong>Date built</strong>: <%= grunt.template.today("dd-mm-yy") %></li> \
                                <li><strong>Internal Url</strong>: <a href="<%= contentJson.attributes.internal.url %>"><%= contentJson.attributes.internal.url %></a></li> \
                                <li><strong>Google tracking id</strong>: <%= contentJson.attributes.googleTrackingID %></li> \
                            </ul> \
                        </body>'
                    }
                }
            },
            external: {
                options: {
                    message: {
                        from: "fishawack.auto.package@gmail.com",
                        subject: 'Auto-package:External: <%= pkg.name %> - <%= contentJson.attributes.title %>',
                        html: '<body>\
                            <h2><%= pkg.name %></h2> \
                            <ul> \
                                <li><strong>Instance name</strong>: <%= contentJson.attributes.title %></li> \
                                <li><strong>Build version</strong>: <%= pkg.version %></li> \
                                <li><strong>Date built</strong>: <%= grunt.template.today("dd-mm-yy") %></li> \
                                <li><strong>External Url</strong>: <a href="<%= contentJson.attributes.external.url %>"><%= contentJson.attributes.external.url %></a></li> \
                                <ul> \
                                    <li><strong>Username</strong>: <%= contentJson.attributes.external.username %></li> \
                                    <li><strong>Password</strong>: <%= contentJson.attributes.external.password %></li> \
                                </ul> \
                                <li><strong>Internal Url</strong>: <a href="<%= contentJson.attributes.internal.url %>"><%= contentJson.attributes.internal.url %></a></li> \
                                <li><strong>Zipped package (copy&paste, minecast blocks)</strong>:<a href="<%= contentJson.attributes.autoPackage.url %><%= pkg.name %>/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>.zip"><%= contentJson.attributes.autoPackage.url %><%= pkg.name %>/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>.zip</a></li> \
                                <li><strong>Google tracking id</strong>: <%= contentJson.attributes.googleTrackingID %></li> \
                            </ul> \
                        </body>'
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '_Output'
                }
            }
        },
        'special-html': {
            compile: {
                expand: true,
                cwd: '_Output/',
                src: ['*.html'],
                dest: '_Output/'
            }
        },
        browserSync: {
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
    });

    // Need to run everytime regardless of task - allows watch to still work on tests
    grunt.task.run('karma:unit:start');

    // Always need to have content to init some tasks
    grunt.task.run(['content']);

    grunt.registerTask('done', function(){
        // Second phase config values that need content to initialize

        var parseString = require('xml2js').parseString;
        var xmlJson = null;

        parseString(grunt.file.read('_Build/xml/maintopics.xml'), function (err, result) {
            xmlJson = result;
        });

        grunt.config.set('casperjs', {
            options: {
                casperjsOptions: [
                    '--url=' + String.format(contentJson.attributes.local.url, getIP(), ('~' + process.env.USER)),
                    '--contentCount=' + (grunt.file.expand({cwd: '_Build/xml/content/' }, '*').length),
                    '--firstCat=' + xmlJson.topics.topic[0].$.id,
                    '--firstSub=' + xmlJson.topics.topic[0].subtopic[0].$.id,
                    '--firstUpdated=' + contentJson.content.index.updatedList[1].value,
                    '--firstKey=' + xmlJson.topics.topic[0].subtopic[0].keymessage[0].$.id
                ]
            },
            dist: {
                options: {
                    casperjsOptions: [
                        '--url=' + contentJson.attributes.internal.url, 
                        '--contentCount=' + (grunt.file.expand({cwd: '_Build/xml/content/' }, '*').length),
                        '--firstCat=' + xmlJson.topics.topic[0].$.id,
                        '--firstSub=' + xmlJson.topics.topic[0].subtopic[0].$.id,
                        '--firstUpdated=' + contentJson.content.index.updatedList[1].value,
                        '--firstKey=' + xmlJson.topics.topic[0].subtopic[0].keymessage[0].$.id
                    ]
                },
                src: ['_Test/casperjs/*.js']
            },
            local: {
                src: ['_Test/casperjs/*.js']
            }
        });

        watchSmokeTests();
    });

    grunt.registerTask('default', ['sass:dev', 'postcss', 'jshint', 'modernizr', 'concat:dev', 'copy', 'fontello_svg', 'svgfit', 'svgmin', 'grunticon', 'compile-handlebars', 'includereplace', 'htmlmin', 'special-html', 'clean:build', 'browserSync', 'watch']);

    grunt.registerTask('dist', ['clean:dist', 'sass:dist', 'postcss', 'jshint', 'modernizr', 'concat:dist', 'uglify:dist', 'copy', 'fontello_svg', 'svgfit', 'svgmin', 'grunticon', 'compile-handlebars', 'includereplace', 'htmlmin', 'special-html', 'imagemin', 'clean:build', 'connect', 'casperjs:local', 'karma:continuous', 'compress']);
};