var x = require('casper').selectXPath,
	url = casper.cli.get('url'),
	contentCount = casper.cli.get('contentCount'),
	firstCat = casper.cli.get('firstCat'),
	firstSub = casper.cli.get('firstSub'),
	firstUpdated = casper.cli.get('firstUpdated'),
	firstKey = casper.cli.get('firstKey'),
	searchTerm = 'hello';

casper.test.begin('Testing key message', function suite(test) {
	require('./modules/include.js')(test);

	casper.start(url + 'keyMessage.html', function(){
		test.assertHttpStatus(200);
	});

	clickLink('#js_backButton', url + 'results.html?cat=0&sub=0&last=0&search=0&filter=0', 'back button links to index');

	opensDocInPopup('#keypdf', 'master.pdf');
	opensDocInPopup('#keydocx', 'master.docx');

	test_header();

	casper.then(function(){
		test.assertVisible('.js_keyMessageNo', "No results text visible");

		test.comment('Clicking reference tab');
		this.click('#js_tabReferences');
		test.assertVisible('.js_referencesNo', "No references text visible");

		if (this.exists('#js_tabRelated')) {
			casper.then(function() {
				test.comment('Clicking related questions tab');
			    this.click('#js_tabRelated');
				test.assertVisible('#js_relatedKMs', "No related text visible");
			});
		}
	})

	casper.run(function () {
		test.done();
	});
});