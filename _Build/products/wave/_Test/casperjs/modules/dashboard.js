module.exports = function(test){
	test_dashboard = function(players){
		casper.then(function() {

			// If theres a terms link it should link to the terms page
			clickPossibleLink('#terms', url + 'terms.html', 'terms button links to terms page');

			// Gallery should have more than one child, shouldn't be using index page if only single player
			hasSameAsNChildren('.gallery', players.length);

			// Click all dashboard links and check they correctly link to player names
			links = this.evaluate(function() {
		        var elements = __utils__.findAll('.gallery a');
		        return elements;
		    });

		    var i = 1;
		    this.repeat(links.length, function() {
				clickLink('.gallery div:nth-child(' + i + ') a', url + players[i - 1] + '.html', 'dashboard button ' + i + ' correctly links to ' + players[i - 1]);
				i++;
			});

			checkAllResourcesFound();
		});
	}
}