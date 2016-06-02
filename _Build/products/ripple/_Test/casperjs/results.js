var x = require('casper').selectXPath,
	url = casper.cli.get('url'),
	contentCount = casper.cli.get('contentCount'),
	firstCat = casper.cli.get('firstCat'),
	firstSub = casper.cli.get('firstSub'),
	firstUpdated = casper.cli.get('firstUpdated'),
	firstKey = casper.cli.get('firstKey'),
	searchTerm = 'hello';

casper.test.begin('Testing results', function suite(test) {
	require('./modules/include.js')(test);

	casper.start(url + 'results.html', function(){
		test.assertHttpStatus(200);
	});

	casper.then(function() {
		test.assertEvalEquals(function(){ 
			return (+$('#js_resultsList').children().length - 1); /* - 1 because of the no results that gets prepended */ 
		}, contentCount, "correct amount of articles - " + contentCount);
	});

	clickLink('#js_backButton', url + 'index.html', 'back button links to index');
	test_header();

	clickLink(x('//ul[@id="js_resultsList"]//li[2]//a'), url + 'keyMessage.html?cat=0&sub=0&last=0&search=0&filter=0&kmID=' + firstKey + '', 'Navigates to key message ' + firstKey);

	casper.run(function () {
		test.done();
	});
});