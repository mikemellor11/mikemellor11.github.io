var x = require('casper').selectXPath,
	url = casper.cli.get('url'),
	contentCount = casper.cli.get('contentCount'),
	firstCat = casper.cli.get('firstCat'),
	firstSub = casper.cli.get('firstSub'),
	firstUpdated = casper.cli.get('firstUpdated'),
	firstKey = casper.cli.get('firstKey'),
	searchTerm = 'hello';

casper.test.begin('Testing index', function suite(test) {
	require('./modules/include.js')(test);

	casper.start(url + 'index.html', function(){
		test.assertHttpStatus(200);
	});

	casper.then(function() {
		hasMoreThanNChildren('#js_categories', 2);
		hasSameAsNChildren('#js_subCategories', 1);
		hasMoreThanNChildren('#js_lastUpdated', 2);
	});

	opensDocInPopup('#fullpdf', 'master.pdf');
	opensDocInPopup('#fulldocx', 'master.docx');
	opensDocInPopup('#recentpdf', 'recentUpdates.pdf');
	opensDocInPopup('#recentdocx', 'recentUpdates.docx');

	test_header();
	
	clickLink('#navBrowse', url + 'results.html?cat=0&sub=0&last=0&search=0&filter=0', 'browse button no drop downs selected - links to all results');
	clickLink('#navSearch', url + 'results.html?cat=0&sub=0&last=0&search=0&filter=0', 'search button no drop downs selected and without filter - links to all results');

	casper.then(function(){
		this.sendKeys('#js_searchTerms', searchTerm, {keepFocus: true});
		this.sendKeys('#js_searchTerms', casper.page.event.key.Enter, {keepFocus: true});
	});

	casper.then(function() {
		test.assertUrlMatch(url + 'results.html?cat=0&sub=0&last=0&search=' + searchTerm + '&filter=0', 'search button no drop downs selected without filter - links to all searched results');
		casper.back();
	});

	casper.then(function(){
		this.click('#toggle');
	});

	clickLink('#navSearch', url + 'results.html?cat=0&sub=0&last=0&search=' + searchTerm + '&filter=1', 'search button no drop downs selected and with filter - links to filtered results');

	casper.then(function(){
		this.sendKeys('#js_searchTerms', casper.page.event.key.Enter, {keepFocus: true});
	});

	casper.then(function() {
		test.assertUrlMatch(url + 'results.html?cat=0&sub=0&last=0&search=' + searchTerm + '&filter=1', 'search button no drop downs selected with filter - links to filtered searched results');
		casper.back();
	});

	casper.then(function(){
		test.assertEvalEquals(function(){ return +$('.js_articleTotal').text(); }, contentCount, "correct amount of articles - " + contentCount);

		test.comment("Selecting first option on each drop down");
		setDropDown('#js_categories', 2);
		hasMoreThanNChildren('#js_subCategories', 2);
		setDropDown('#js_subCategories', 2);
		setDropDown('#js_lastUpdated', 2);

		hasLessThanNChildren('.js_articleTotal', contentCount);
	});

	clickLink('#navBrowse', url + 'results.html?cat=' + firstCat + '&sub=' + firstSub + '&last=' + firstUpdated + '&search=0&filter=0', 'browse button drop downs selected and without filter - links to results');

	casper.run(function () {
		test.done();
	});
});