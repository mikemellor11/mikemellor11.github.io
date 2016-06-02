module.exports = function(test){
	require('./header.js')(test);

	hasMoreThanNChildren = function(selector, count){
		test.assertEval(function (args) {
	        return ($(args.selector).children().length > args.count);
	    }, selector + ' has more than ' + count + ' children', {selector: selector, count: count});
	}

	hasLessThanNChildren = function(selector, count){
		test.assertEval(function (args) {
	        return ($(args.selector).children().length < args.count);
	    }, selector + ' has less than ' + count + ' children', {selector: selector, count: count});
	}

	hasSameAsNChildren = function(selector, count){
		test.assertEval(function (args) {
	        return ($(args.selector).children().length === args.count);
	    }, selector + ' has exactly ' + count + ' children', {selector: selector, count: count});
	}

	setDropDown = function(selector, count){
		casper.evaluate(function (selector, count) {
		    document.querySelector(selector).selectedIndex = count; 
		    $(selector).change();
		}, selector, count);
	}

	opensDocInPopup = function(selector, doc){
		casper.then(function() {
		    this.click(selector);
		});

		casper.waitForPopup('', function(){}, function(){
			test.assert(false, selector + ' fails to open ' + doc + ' in popup');
		});

		casper.withPopup('', function() {
			test.assert(true, selector + ' opens ' + doc + ' in popup');
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
}