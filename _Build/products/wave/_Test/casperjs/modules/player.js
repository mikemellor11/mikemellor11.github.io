module.exports = function(test){
	test_player = function(player, localJson){
		casper.test.begin('Testing ' + player + ' player', function suite(test) {
			casper.start(url + player + '.html', function(){
				test.assertHttpStatus(200);
			});

			casper.then(function() {

				clickPossibleLink('#terms', url + 'terms.html', 'terms button links to terms page');

				if(localJson.headerButton && localJson.headerButton.url){
					clickPossibleLink('header a', url + localJson.headerButton.url, 'home button in header links to ' + localJson.headerButton.url + ' page');
				}

				hasSameAsNChildren('.wave__chapters .wave__stamps', localJson.timeStamps.length);

				hasSameAsNChildren('.wave__flags', localJson.timeStamps.length);

				checkAllResourcesFound();
			});

			casper.run(function () {
				test.done();
			});
		});
	}
}