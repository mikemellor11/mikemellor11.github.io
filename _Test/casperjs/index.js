var x = require('casper').selectXPath,
	url = casper.cli.get('url');

casper.test.begin('Testing index', function suite(test) {
	require('./modules/include.js')(test);
	
	casper.start(url + 'index.html', function(){
		test.assertHttpStatus(200);
	});

	casper.then(function() {
		checkAllResourcesFound();
	});

	casper.run(function () {
		test.done();
	});
});