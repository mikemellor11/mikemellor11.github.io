var x = require('casper').selectXPath,
	url = casper.cli.get('url'),
	players = JSON.parse(casper.cli.get('players')),
	contentJson = JSON.parse(casper.cli.get('contentJson'));

var dashboard = false;

casper.test.begin('Testing index', function suite(test) {
	require('./modules/include.js')(test);

	casper.start(url + 'index.html', function(){
		test.assertHttpStatus(200);
		test.assertTitle(contentJson.attributes.title);
	});

	casper.then(function() {
		// Check if player or index page
		if(casper.exists('#dashboard')){
			test_dashboard(players);
			dashboard = true;
		} else {
			test_player(players[0], contentJson.content[0]);
		}
	})
	casper.run(function () {
		test.done();
	})
	.then(function(){
		// Test player pages if theres multiple, if not most likely was tested above (some edge cases)
		if(dashboard){
			var i = 0;
		    this.repeat(players.length, function() {
		    	test_player(players[i], contentJson.content[i]);
				i++;
			});
		}
	});
});