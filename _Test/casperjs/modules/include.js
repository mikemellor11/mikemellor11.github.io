module.exports = function(test){
	hasMoreThanNChildren = function(selector, count){
		casper.then(function() {
			test.assertEval(function (args) {
		        return (document.querySelector(args.selector).children.length > args.count);
		    }, selector + ' has more than ' + count + ' children', {selector: selector, count: count});
	    });
	}

	hasLessThanNChildren = function(selector, count){
		casper.then(function() {
			test.assertEval(function (args) {
		        return (document.querySelector(args.selector).children.length < args.count);
		    }, selector + ' has less than ' + count + ' children', {selector: selector, count: count});
		});
	}

	hasSameAsNChildren = function(selector, count){
		casper.then(function() {
			test.assertEval(function (args) {
		        return (document.querySelector(args.selector).children.length === args.count);
		    }, selector + ' has exactly ' + count + ' children', {selector: selector, count: count});
		});
	}

	clickLink = function(selector, url, comment){
		casper.then(function() {
		    this.click(selector);
		});

		casper.then(function() {
			test.assertUrlMatch(url, comment);
		});

		casper.back();
	}

	clickPossibleLink = function(selector, url, comment){
		casper.then(function() {
			if (this.exists(selector)) {
				casper.then(function() {
				    this.click(selector);
				});

				casper.then(function() {
					test.assertUrlMatch(url, comment);
				});

				casper.back();
			}
		});
	}

	checkAllResourcesFound = function(){
		var resourcesMissing = [];

		// Check all images get loaded
		casper.on('resource.received', function(resource) {
			if(resource.stage === 'end'){
				if((resource.status !== 200 && resource.status !== 304) && resource.status !== null && resourcesMissing.indexOf(resource.url) === -1){
					resourcesMissing.push(resource.url);
				}
			}
		});

		casper.then(function() {
			if(resourcesMissing.length <= 0){
				test.pass('All resources found');
			} else {
				var i = 0;
			    this.repeat(resourcesMissing.length, function() {
					test.assertResourceExists(resourcesMissing[i], 'Concerned about the following resource, checking if it actually exists - ' + resourcesMissing[i]);
					i++;
				});
			}
		});
	}
}