module.exports = function(grunt) {
	
	this.buildGruntIconColors = function (){
		// Grab fontello config, use to setup auto hover grunticons, then grab customSVHovers to add custom hovers
        var iconsJson = grunt.file.readJSON('_Build/icons/config.json');
        var hoversJson = grunt.file.readJSON('_Build/sass/components/customSVGHovers.json');
        var customSelectors = {};

		// Create hover versions for both normal and flip colors for every icon in config.json
        iconsJson.glyphs.forEach(function(d){
            customSelectors[d.css + '-iconHover'] = [".icon-" + d.css + "-iconColor:hover"]
            customSelectors[d.css + '-iconHoverFlip'] = [".icon-" + d.css + "-iconColorFlip:hover"]
        });

        /* OPTIONS */
        // - svg (string) - the actual icon you're talkign about
        // - selector (array / strings) - the new selectors you want to be involved with the above icon
        // - self (string) - if false, it will look inside selectors provided and target the iconColor/Flip and also apply, useful for selectBox:hover showing the hover icon for the usual icon
        // if true it will apply the icon on the selector itself as a background image
        // - custom (string) - when false will automatically append iconHover to svg name as this is the usual case, when true can target other svgs
        // Loop over each custom object
        hoversJson.forEach(function(d){
            var hoverName = d.svg + ((d.custom) ? '' : '-iconHover'); // append new hover from above or not if custom set

            if(hoverName !== undefined && hoverName !== null){
                if(!customSelectors.hasOwnProperty(hoverName)){ // Check the new hover exists, should have been created above
                    customSelectors[hoverName] = []; // Create array that gets passed to grunticon for extra selectors
                }

                d.selector.forEach(function(dl){ // Each custom icon set the new selector and its normal icon to be the hover state
                    customSelectors[hoverName].push((dl + ((!d.self) ? (' .icon-' + d.svg + ((d.custom) ? '' : '-iconColor')) : ''))); // if self it won't target the icon inside the svg, it'll target the svg itself
                });
            }

            if(!d.custom){
                hoverName = d.svg + ((d.custom) ? '' : '-iconHoverFlip');
                if(hoverName !== undefined && hoverName !== null){
                    if(!customSelectors.hasOwnProperty(hoverName)){
                        customSelectors[hoverName] = [];
                    }

                    d.selector.forEach(function(dl){
                        customSelectors[hoverName].push((dl + ((!d.self) ? (' .icon-' + d.svg + ((d.custom) ? '' : '-iconColorFlip')) : '')));
                    });
                }
            }
        });

        return customSelectors;
	};

	this.watchSmokeTests = function (){
		// Create test watches so that updating a test file only runs tests for that file. All tests run on grunt dist and grunt deploy
	    var watch = grunt.config.get('watch') || {};
	    var casperjs = grunt.config.get('casperjs') || {};
	    var casperPath = '_Test/casperjs/';

	    grunt.file.expand({cwd: casperPath}, '*.js').forEach(function(d){
	        watch['smokeTests-' + d] = {
	            files: [casperPath + d],
	            tasks: ['casperjs:' + d],
	            options: {
	                spawn: false,
	            }
	        };

	        casperjs[d] = {
	            src: [casperPath + d]
	        };
	    });

	    grunt.config.set('watch', watch);
	    grunt.config.set('casperjs', casperjs);
	}

	this.getIP = function () {
	    var os = require('os');
	    var ifaces = os.networkInterfaces();
	    var storeIP = '';

	    Object.keys(ifaces).forEach(function (ifname) {
	      var alias = 0
	        ;

	      ifaces[ifname].forEach(function (iface) {
	        if ('IPv4' !== iface.family || iface.internal !== false) {
	          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
	          return;
	        }

	        if (alias >= 1) {
	          // this single interface has multiple ipv4 addresses
	          //console.log(ifname + ':' + alias, iface.address);
	          storeIP = iface.address;
	        } else {
	          // this interface has only one ipv4 adress
	          //console.log(ifname, iface.address);
	          storeIP = iface.address;
	        }
	      });
	    });

	    return storeIP;
	}

	this.getSassVariable = function (variable, sass) {
	    var vars = sass.split('\n');
	    for (var i = 0; i < vars.length; i++) {
	        var pair = vars[i].split('//')[0].split(';')[0].split(':');
	        if (pair[0].trim() === variable) {
	            return pair[1].trim();
	        }
	    }
	    console.log('Sass variable %s not found', variable);
	}

	this.fileExists = function (name, fileLocation, grunt) {
	    var found = false;
	    if(name !== null || fileLocation !== null || grunt !== null)
	    {
	        grunt.file.expand({cwd: fileLocation }, '*').forEach(function(element, index){
	            if(element.toLowerCase().localeCompare(name.toLowerCase()) == 0)
	                found = true;
	        });
	    }

	    return found;
	}

	if (!String.format) {
	  String.format = function(format) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    return String(format.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number] 
	        : match
	      ;
	    }));
	  };
	}

	this.contentPath = (fileExists('content.json', '_Build/', grunt)) ? '_Build/content.json' : '_Build/example/content.json';

	this.contentJson = grunt.file.readJSON(contentPath);
}